import { PeopleEngine } from "../controllers/peopleEngineRequests";
import { getAllCampus, getUserTokenForAPI, getGraphUserFromToken, getUserTokenForGraph } from "./util";
import { userCache, campusCache, hubCache } from "../../cache/controller/cacheObjects";


describe("Campus operations", () => {
    test("Get all campus", async () => {
        let graphCampus: any = JSON.parse(await getAllCampus());
        let peopleEngineCampus = await PeopleEngine.getAllCampus();
        graphCampus.value.forEach((campus: { id: any; }) => {
            expect(peopleEngineCampus.some((element => {
                //@ts-ignore
                return element.aadGroupId === campus.id;
            }))).toBe(true);
        })

    })

})

describe("Current user operations", () => {
    test("Get user from token", async () => {
        let userAPIToken = await getUserTokenForAPI();
        let userGraphToken = await getUserTokenForGraph();
        let graphUser = JSON.parse(await getGraphUserFromToken(userGraphToken));
        let engineUser = await PeopleEngine.getCurrentUser(userAPIToken);
        if (!engineUser) throw ("Current user does not exist!");
        else {
            expect(engineUser.id).toBe(graphUser.id);
            expect(engineUser.displayName).toBe(graphUser.displayName);
            expect(engineUser.jobTitle).toBe(graphUser.jobTitle);
            expect(engineUser.mail).toBe(graphUser.mail);
        }
    })
    test("Get users campus", async () => {
        await userCache.init();
        await campusCache.init();
        let APIToken = await getUserTokenForAPI();
        let currentCampus = await PeopleEngine.getCurrentUserCampus(APIToken);
        expect(campusCache.exists(currentCampus.id)).toBe(true);
    })
    test("Get users hub", async () => {
        await userCache.init();
        await campusCache.init();
        await hubCache.init();
        let APIToken = await getUserTokenForAPI();
        let currentHub = await PeopleEngine.getCurrentUserHub(APIToken);
        expect(hubCache.exists(currentHub.aadGroupId)).toBe(true);
    })
    /* test("Create users", async () => {
        fail("Has yet to be defined!");
        //TODO: Create users with forbidden characters üöäß
        //TODO: Create users with multiple first and last names (Test Testus User Userius)
    }) */
})
