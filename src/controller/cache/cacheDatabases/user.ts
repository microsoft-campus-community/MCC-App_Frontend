import jwt from "jsonwebtoken";
import { _User, _AADToken } from "../../../models/database/user";
import { _Campus } from "../../../models/database/campus";
import { _Cache } from "../../../models/cache/cache";
import { _Project } from "../../../models/database/project";
import { PeopleEngine } from "../../database/engineRequests";

class UserCache implements _Cache<UserCache, _User>, _CacheDatabase<UserCache> {
    private dataMap: { [key: string]: _User };

    constructor() {
        this.dataMap = {};
        setInterval(async () => {
            await this.refresh()
        }, 60 * 60 * 1000)
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
                if (dbUser) {
                    let user = await new User(undefined, dbUser.id).init();
                    //let user = await new User(undefined,dbUser.id).init();
                    this.dataMap[user.id] = user;
                    resolve(user);
                }
                else console.error(`User with ID ${id} could not been found in the database!`);

            }
        })
    }
    async init(): Promise<UserCache> {
        return new Promise(async resolve => {
            let users = await PeopleEngine.getAllUsers();
            users.forEach(user => {
                let systemUser = new User(undefined, user.id);
                systemUser.fromJson(user);
                this.dataMap[user.id] = systemUser;
            })
            resolve(this);
        })
    }
    exists(userId: string): boolean {
        let userIds = Object.keys(this.dataMap);
        if (userIds.includes(userId)) return true;
        return false;
    }
    //TODO Implement clear function
    clear(): void {
        this.dataMap = {};
    }
    //TODO Implement refresh function
    async refresh(): Promise<void> {
        return new Promise(async resolve => {
            this.clear();
            await this.init();
            resolve();
        })
    }
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

            let user = await PeopleEngine.getUserById(this.id);
            if (user) this.fromJson(user);
            else console.error(`User ${this.id} doesn't exist in the database and could not been found!`);
            resolve(this);
        })
    }
    fromJson(object: any): void {
        if (object.displayName) {
            this.name = object.displayName;
            this.preferredName = object.displayName;
        }
        if (object.id) this.id = object.id;
        if (object.jobTitle) this.position = object.jobTitle;
        if (object.isAdmin) this.admin = true;
        if (object.isCampusLead || object.isHubLead) this.lead = true;
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
