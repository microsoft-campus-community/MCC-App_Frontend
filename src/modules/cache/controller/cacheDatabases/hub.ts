import { _Hub } from "../../models/hub";
import { _Campus } from "../../models/campus";
import { _User } from "../../models/user";
import { User } from "./user";
import { PeopleEngine } from "../../../database/controllers/peopleEngineRequests";
import { _PeopleEngineHub } from "../../../database/models/_peopleEngine";
import { userCache, campusCache } from "../cacheObjects";
import { _Cache } from "../../models/cacheStructure";


export class HubCache implements _Cache<HubCache, _Hub> {
    dataMap: { [key: string]: _Hub };

    constructor() {
        this.dataMap = {
        }
        setInterval(async () => {
            await this.refresh()
        }, 60 * 60 * 1000);
    }

    set(hubObj: _Hub): Promise<boolean> {
        return new Promise(resolve => {
            this.dataMap[hubObj.id] = hubObj;
            resolve(true);
        })

    }
    async get(hubId: string): Promise<_Hub | undefined> {
        return new Promise(resolve => {
            resolve(this.dataMap[hubId]);
        })
    }
    exists(id: string): boolean {
        if (this.dataMap[id]) return true;
        return false;
    }
    async init(): Promise<HubCache> {
        return new Promise(async resolve => {
            let allDatabaseHubs = await PeopleEngine.getAllHubs();
            let hubPromises: Array<Promise<_Hub>> = [];

            allDatabaseHubs.forEach(hub => {
                hubPromises.push(Hub.fromObject(hub));
            })
            let hubs = await Promise.all(hubPromises);
            hubs.forEach(hub => {
                this.dataMap[hub.id] = hub;
            })
            resolve(this);
        })
    }
    clear() {
        this.dataMap = {};
    }
    async refresh() {
        return new Promise(async resolve => {
            this.clear();
            await this.init();
            resolve();
        })
    }
}

export class Hub implements _Hub {
    name: string;
    lead: _User;
    id: string;
    campus: Array<_Campus>;

    constructor(hubObject: _PeopleEngineHub) {
        this.id = hubObject.aadGroupId;
        this.name = hubObject.name;
        this.lead = new User(undefined, hubObject.lead);
        this.campus = [];
    }

    static async fromId(hubId: string): Promise<_Hub> {
        return new Promise(async resolve => {
            let engineHub = await PeopleEngine.getHub(hubId);
            let hub = new Hub(engineHub);
            await hub.init();
            resolve(hub);
        })
    }
    static async fromObject(hubObject: _PeopleEngineHub): Promise<_Hub> {
        return new Promise(async resolve => {
            let hub = new Hub(hubObject);
            await hub.init();
            resolve(hub);
        })
    }

    async init(): Promise<void> {
        return new Promise(async resolve => {
            if (!this.lead.id.startsWith("00000000")) {
                let leadObject = await userCache.get(this.lead.id);
                if (leadObject) this.lead = leadObject;
            }
            let belongingCampus = await PeopleEngine.getAllCampusInHub(this.id);
            belongingCampus.forEach(async campus => {
                let cachedCampus = await campusCache.get(campus.aadGroupId);
                if (cachedCampus) this.campus.push(cachedCampus);
            })
            resolve();
        })
    }
}
