import {userCache} from "../controller/cacheObjects";
import { User } from "../controller/cacheDatabases/user";
import config from "../../../config";

test("User cache accepts new Users", async () => {
    let user = new User(undefined,config.systemUser);
    await userCache.set(user);
    expect(await userCache.get(config.systemUser)).toBe(user);
})
