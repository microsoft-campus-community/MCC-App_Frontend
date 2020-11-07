import { PeopleEngine } from "../../database/controllers/peopleEngineRequests"
import { Hub } from "../controller/cacheDatabases/hub";

describe("Hub tests", () => {
    test("Hub initializes from ID", async () => {
        let databaseHubs = await PeopleEngine.getAllHubs();
        let hub = await Hub.fromId(databaseHubs[0].aadGroupId);
        expect(hub.name).toBe(databaseHubs[0].name);
        expect(hub.id).toBe(databaseHubs[0].aadGroupId);
        expect(hub.lead.id).toBe(databaseHubs[0].lead);
    })
})
