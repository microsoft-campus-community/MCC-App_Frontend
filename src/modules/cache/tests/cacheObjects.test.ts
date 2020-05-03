import {userCache, campusCache} from "../controller/cacheObjects";
import { User } from "../controller/cacheDatabases/user";
import config from "../../../config";
import { PeopleEngine } from "../../database/controllers/peopleEngineRequests";
import { Campus } from "../controller/cacheDatabases/campus";

describe("User cache", () => {
    test("User cache initializes correctly", async () => {
        await userCache.init();
        let users = await PeopleEngine.getAllUsers();
        users.forEach(user => {
            expect(userCache.exists(user.id)).toBe(true);
        })
    })
    test("User cache refreshs correctly", async () => {
        await userCache.init();
        let cacheCopy = Object.assign({},userCache.dataMap);
        await userCache.refresh();
        let copyUsersIds = Object.keys(cacheCopy);
        copyUsersIds.forEach(key => {
            expect(userCache.exists(key)).toBe(true);
        })
    })
    test("User cache accepts new Users", async () => {
        let user = new User(undefined,config.systemUser);
        await userCache.set(user);
        expect(await userCache.get(config.systemUser)).toEqual(user);
    });
})

describe("Campus cache", () => {
    test("Campus cache initializes correctly", async () => {
        let requests = Promise.all([campusCache.init(),PeopleEngine.getAllCampus()])
        let results = await requests;
        let campus = results[1];
        campus.forEach(campus => {
            expect(campusCache.exists(campus.id)).toBe(true);
        })
    })
    test("Campus cache refreshs correctly", async () => {
        await campusCache.init();
        let cacheCopy = Object.assign({},campusCache);
        await campusCache.refresh();
        let copyCampusIds = Object.keys(cacheCopy.dataMap);
        copyCampusIds.forEach(key => {
            expect(campusCache.exists(key)).toBe(true);
        })
    })
    test("Campus cache accepts new campus", async () => {
        let campus = new Campus((await PeopleEngine.getAllCampus())[0]);
        await campusCache.set(campus);
        expect(await campusCache.get(campus.id)).toEqual(campus);
    });
})
