import { userCache, campusCache, hubCache } from "../controller/cacheObjects";
import { User } from "../controller/cacheDatabases/user";
import config from "../../../config";
import { PeopleEngine } from "../../database/controllers/peopleEngineRequests";
import { Campus } from "../controller/cacheDatabases/campus";
import { _Campus } from "../models/campus";
import { Hub } from "../controller/cacheDatabases/hub";

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
        let cacheCopy = Object.assign({}, userCache.dataMap);
        await userCache.refresh();
        let copyUsersIds = Object.keys(cacheCopy);
        copyUsersIds.forEach(key => {
            expect(userCache.exists(key)).toBe(true);
        })
    })
    test("User cache accepts new Users", async () => {
        let user = new User(undefined, config.systemUser);
        await userCache.set(user);
        expect(await userCache.get(config.systemUser)).toEqual(user);
    });
})

describe("Campus cache", () => {
    test("Cache initializes", async () => {
        let requests = await Promise.all([campusCache.init(), PeopleEngine.getAllCampus()]);
        let allGraphCampus = requests[1];
        allGraphCampus.forEach(campus => {
            expect(campusCache.exists(campus.id)).toBe(true);
        })
    })
    test("Cache refreshs", async () => {
        await campusCache.init();
        let cacheCopy = Object.assign({}, campusCache);
        await campusCache.refresh();
        let copyCampusIds = Object.keys(cacheCopy.dataMap);
        copyCampusIds.forEach(key => {
            expect(campusCache.exists(key)).toBe(true);
        })
    })
    test("Cache accepts new campus", async () => {
        let allGraphCampus = await PeopleEngine.getAllCampus();
        let campus = new Campus(allGraphCampus[0]);
        await campusCache.set(campus);
        expect(await campusCache.get(campus.id)).toEqual(campus);
    });
    test("Cache can set new campus", async () => {
        let mockCampus = {
            id: "123532-54245",
            name: "Test campus",
            leadId: "1345-5435",
            memberIds: ["sdgsg", "32424"],
            members: []
        }
        let campus = new Campus(mockCampus);
        let operationSuccessful = await campusCache.set(campus);
        expect(operationSuccessful).toBe(true);
        expect(campusCache.exists(mockCampus.id)).toBe(true);
    })
    test("Cache retrieves all campus names", async () => {
        let requests = await Promise.all([campusCache.init(), PeopleEngine.getAllCampus()]);
        let allGraphCampus = requests[1];
        let campusNames = campusCache.getCampusNameObject();
        allGraphCampus.forEach(graphCampus => {
            expect(
                campusNames.some((cacheCampus) => {
                    return (cacheCampus.id === graphCampus.id && cacheCampus.name === graphCampus.name);
                })
            ).toBe(true);
        })
    })
    test("Cache returns users campus", async () => {
        await userCache.init();
        await campusCache.init();

        let allUserIds = Object.keys(userCache.dataMap);
        let found = 0;
        let notFound = 0;
        let campusQueries: Array<Promise<Array<_Campus>>> = [];
        allUserIds.forEach(userId => {
            campusQueries.push(campusCache.getUserCampus(userId));
        })
        Promise.all(campusQueries).then(results => {
            results.forEach(result => {
                if (result.length > 0) found++;
                else notFound++;
            })
            //The function does not require all users to have a campus, but rather 90% of all users should have a campus attached. Admin users or special occasions might not have a campus.
            expect(found / (found + notFound)).toBeGreaterThanOrEqual(0.9);
        })
    })
})

describe("Hub cache", () => {
    let mockHub = {
        id: "sdgsg",
        name: "Test Campus",
        lead: "0000000",
        leadName: "Test lead",
        aadGroupId: "sdgsg",
        campus: [],
        createdAt: "",
        modifiedAt: "",
        modifiedBy: ""
    }
    test("Cache initializes correctly", async () => {
        let responses = await Promise.all([hubCache.init(), PeopleEngine.getAllHubs()])
        let databaseHubs = responses[1];
        databaseHubs.forEach(hub => {
            expect(hubCache.exists(hub.aadGroupId)).toBe(true);
        })
    })
    test("Cache refreshs", async () => {
        await hubCache.init();
        let cacheCopy = Object.assign({}, hubCache);
        await hubCache.refresh();
        let copyHubIds = Object.keys(cacheCopy.dataMap);
        copyHubIds.forEach(key => {
            expect(hubCache.exists(key)).toBe(true);
        })
    })
    test("Cache accepts new hubs & proves existance", async () => {
        hubCache.set(new Hub(mockHub));
        expect(hubCache.exists(mockHub.aadGroupId)).toBe(true);
        expect(hubCache.exists("SomeGibberish")).toBe(false);
    })
    test("Cache retrieves users", async () => {
        hubCache.set(new Hub(mockHub));
        let retrievedHub = await hubCache.get(mockHub.aadGroupId);
        if (retrievedHub) {
            expect(retrievedHub.id).toBe(mockHub.aadGroupId);
            expect(retrievedHub.lead.id).toBe(mockHub.lead);
            expect(retrievedHub.name).toBe(mockHub.name);
        }
        else fail("Hub could not be retrieved!");

    })
})
