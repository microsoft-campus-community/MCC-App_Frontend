import { Campus } from "../controller/cacheDatabases/campus";
import { PeopleEngine } from "../../database/controllers/peopleEngineRequests";
import { userCache } from "../controller/cacheObjects";

describe("Cache Campus object", () => {
    test("Campus initializes from Object", () => {
        let mockCampus = {
            id: "123532-54245",
            name: "Test campus",
            leadId: "1345-5435",
            memberIds: ["sdgsg", "32424"],
            members: []

        }
        let campus = new Campus(mockCampus);
        expect(campus.id).toBe(mockCampus.id);
        expect(campus.name).toBe(mockCampus.name);
        expect(campus.leadId).toBe(mockCampus.leadId);
        expect(campus.memberIds).toBe(mockCampus.memberIds);
        expect(campus.members).toBe(mockCampus.members);
    })
    test("Campus initializes from id", async () => {
        await userCache.init();
        let allCampus = await PeopleEngine.getAllCampus();
        let campus = new Campus(allCampus[0]);
        await campus.init();
        expect(campus.id).toBe(allCampus[0].aadGroupId);
        expect(campus.name).toBe(allCampus[0].name);
        expect(campus.leadId).toBe(allCampus[0].lead);
        expect(campus.memberIds.length).toBeGreaterThan(0);
    })
})
