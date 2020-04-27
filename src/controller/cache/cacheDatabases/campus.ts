import { _Campus } from "../../../models/database/campus";
import { _User } from "../../../models/database/user";
import { _Cache } from "../../../models/cache/cache";
import { PeopleEngine } from "../../database/engineRequests";
import { userCache } from "../cache";
import { _PeopleEngineCampus, _PeopleEngineUser } from "../../../models/database/engines";


class CampusCache implements _Cache<CampusCache, _Campus> {
    private dataMap: { [key: string]: _Campus };
    private campusNames: Array<string>;

    constructor() {
        this.dataMap = {
        }

        this.campusNames = [];
    }

    set(campusObj: _Campus): Promise<boolean> {
        //TODO
        return new Promise(resolve => {
            this.dataMap[campusObj.id] = campusObj;
            resolve(true);
        })

    }
    getCampusNames(): Array<string> {
        return this.campusNames;
    }
    async get(campusId: string): Promise<_Campus | undefined> {
        return new Promise(resolve => {
            resolve(this.dataMap[campusId]);
            //TODO load campus from database
        })
    }
    init(): Promise<CampusCache> {
        return new Promise(async resolve => {
            let allDatabaseCampus = await PeopleEngine.getAllCampus();
            let memberQueries:Array<Promise<Array<_PeopleEngineUser>>> = [];

            for(let i = 0; i < allDatabaseCampus.length; i++) {
                memberQueries.push(PeopleEngine.getAllCampusMembers(allDatabaseCampus[i].hubId, allDatabaseCampus[i].id))
            }


            let campusMemberMap = await Promise.all(memberQueries);

            for(let i = 0; i < allDatabaseCampus.length; i++) {
                let systemCampusObj:any = {
                    id: allDatabaseCampus[i].id,
                    name: allDatabaseCampus[i].name,
                    leadId: allDatabaseCampus[i].lead,
                    memberIds: [],
                    members: [],
                    eventIds: []
                }
                this.campusNames.push(allDatabaseCampus[i].name);
                let members = campusMemberMap[i];
                let userArr:Array<_User> = [];
                for (let j = 0; j < members.length; j++) {
                    systemCampusObj.memberIds.push(members[j].id);
                    let userObj = await userCache.get(members[j].id);
                    if(userObj != undefined) {
                        userArr.push(userObj);
                    }
                }
                systemCampusObj.members = userArr;
                let systemCampus = new Campus(systemCampusObj);
                userArr.forEach(user => {
                    user.setCampus(systemCampus);
                })
                this.dataMap[systemCampus.id] = systemCampus;
            }

            resolve();
        })
    }
    clear() {
        return;
    }
}

class Campus implements _Campus {
    id: string;
    name: string;
    leadId: string;
    memberIds: Array<string>;
    members: Array<_User>;
    eventIds: Array<string>;

    constructor(campusObj: { [key: string]: any }) {
        this.id = campusObj.id;
        this.name = campusObj.name;
        this.leadId = campusObj.leadId;
        this.memberIds = campusObj.memberIds;
        this.eventIds = campusObj.eventIds;
        this.members = campusObj.members;
    }
    async init(): Promise<void> {
        return new Promise(async resolve => {
            let values = await Promise.all([
                this.getMemberIds()
            ]);
            this.memberIds = values[0];
        })
    }
    async getMemberIds(): Promise<Array<string>> {
        return new Promise(resolve => {
            resolve([]);
        })
    }
}

export default CampusCache;
