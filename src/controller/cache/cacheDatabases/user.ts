import jwt from "jsonwebtoken";
import { _User, _AADToken } from "../../../models/database/user";
import { _Campus } from "../../../models/database/campus";
import { _Cache } from "../../../models/cache/cache";
import { getUserProfile, getCampusId } from "../../../controller/database/user";
import { campusCache } from "../cache";
import { _Project } from "../../../models/database/project";
import { PeopleEngine } from "../../database/engineRequests";

class UserCache implements _Cache<UserCache, _User>, _CacheDatabase<UserCache> {
    private dataMap: { [key: string]: _User };

    constructor() {
        this.dataMap = {};
    }

    set(item: _User): Promise<boolean> {
        return new Promise(async resolve => {
            if (item.id != "") {
                this.dataMap[item.id] = await item.init();
                resolve(true);
            }
            resolve(false);
        })

    }
    async get(id: string): Promise<_User | undefined> {
        return new Promise(async resolve => {
            if (this.dataMap[id]) resolve(this.dataMap[id]);
            else {
                let dbUser = await PeopleEngine.getUserById(id);
                let user = new User(undefined, dbUser.id);
                //let user = await new User(undefined,dbUser.id).init();
                this.dataMap[user.id] = user;
                resolve(user);
            }
        })
    }
    async init(): Promise<UserCache> {
        return new Promise(async resolve => {
            let users = await PeopleEngine.getAllUsers();
            users.forEach(user => {
                let systemUser = new User(undefined,user.id);
                systemUser.fromJson(user);
                this.dataMap[user.id] = systemUser;
            })
            resolve(this);
        })
    }
    clear() { return; }
}

export class User implements _User {
    id: string = "";

    name: string;
    campus: _Campus;
    preferredName: string;
    projectCount: number;
    eventCount: number;
    position: string;
    projects: Array<_Project>;
    eventIds: Array<string>;

    token: string = "";
    userInformation?: _AADToken;
    admin: boolean;
    lead: boolean;

    constructor(jwtToken?: string, userId?: string) {
        if (jwtToken) this.storeToken(jwtToken);
        else if (userId) this.id = userId;
        else { throw "No jwtToken or userId provided for user instantiation!" }

        this.name = "";
        this.preferredName = "";

        this.campus = {} as any;
        this.position = "";
        this.projectCount = 0;
        this.eventCount = 0;
        this.projects = [];
        this.eventIds = [];
        this
        this.admin = false;
        this.lead = false;
    }

    async init(): Promise<_User> {
        return new Promise(async resolve => {
            let queries: Array<Promise<any>> = [
                getCampusId(this.token),
                getUserProfile(this.token),
                //getProjectIds(this.id),
                //getEventIds(this.id)
            ];
            let responses = await Promise.all(queries);

            let campus = await campusCache.get(responses[0]);
            if (!campus) {
                console.error(`Campus ${responses[0]} not found when initializing user!`);
                //TODO Only for mockup purposes!
                //return;
            };
            this.campus = campus || {} as any;
            this.admin = responses[1].admin;
            this.lead = responses[1].lead;
            this.position = responses[1].position;
            this.name = responses[1].name;
            this.preferredName = responses[1].preferredName;
            // this.projectCount = responses[2].length;
            // this.eventCount = responses[3].length;

            // let projectIds: Array<string> = responses[3];
            // projectIds.forEach(async id => {
            // 	let project = await projectCache.get(id);
            // 	if (!project) { console.error(`Project ${id} not found when initializing user!`); return };
            // 	this.projects.push(project);
            // })
            // //TODO load all events
            // this.eventIds = responses[4];
            resolve(this);

        })
    }
    fromJson(object: any): void {
        if(object.displayName) {
            this.name = object.displayName;
            this.preferredName = object.displayName;
        }
        if(object.id) this.id = object.id;
        if(object.jobTitle) this.position = object.jobTitle;
        if(object.isAdmin) this.admin = true;
        if(object.isCampusLead || object.isHubLead) this.lead = true;
    }
    storeToken(jwtToken: string): void {
        let tokenInfo = jwt.decode(jwtToken);
        let parsedToken: any = {};
        parsedToken = typeof tokenInfo === "string" ? JSON.parse(tokenInfo) : tokenInfo;
        this.id = parsedToken["oid"];
        this.token = jwtToken;
        parsedToken.scp = parsedToken.scp.split(" ");
        this.userInformation = parsedToken;
    }
    setCampus(campus: _Campus): void {
        this.campus = campus;
    }
}

export default UserCache;
