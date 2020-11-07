import { User } from "../controller/cacheDatabases/user"
import jwt from "jsonwebtoken";
import { getTokenFromUser } from "./util";

describe("Cache user object", () => {
    describe("User initializes", () => {
        test("From Object", () => {
            let mockUser = {
                displayName: "Test User",
                id: "123532-54245",
                jobTitle: "Test User",
                admin: false,
                isCampusLead: false,
                isHubLead: true
            }
            let user = new User(undefined, mockUser.id);
            user.fromJson(mockUser);
            expect(user.id).toBe(mockUser.id);
            expect(user.name).toBe(mockUser.displayName);
            expect(user.preferredName).toBe(mockUser.displayName);
            expect(user.position).toBe(mockUser.jobTitle);
            expect(user.admin).toBe(mockUser.admin);
            expect(user.lead).toBe(mockUser.isCampusLead || mockUser.isHubLead);
        })

        test("From Bearer token", async () => {
            let userToken = await getTokenFromUser();
            let user = new User(userToken);
            let tokenInformation = jwt.decode(userToken);
            if(typeof tokenInformation !== "string" && tokenInformation != null) {
                expect(user.id).toBe(tokenInformation["oid"]);
            }
            else throw "User token has invalid shape, test cannot be completed!";
        })
        test("From invalid scope", () => {
            try {
                new User();
            }
            catch(e) {
                expect(e).toBe("No jwtToken or userId provided for user instantiation!");
            }
        })
    })

})
