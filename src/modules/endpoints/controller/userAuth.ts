import request from "request";

import config from "../../../config";

import { userCache } from "../../cache/controller/cacheObjects";
import { User } from "../../cache/controller/cacheDatabases/user";

export function getRedirectUrlToLogin(state?:string):string {
    return "https://login.microsoftonline.com/" + config.tenantId + "/oauth2/v2.0/authorize?" +
    "client_id=" + config.clientId +
    "&response_type=code" +
    "&redirect_uri=" + config.baseUrl + config.redirectUrl +
    "&response_mode=query" +
    "&state= " + state +
    "&scope=" + config.scope
}

/**
 *
 * @param authCode
 * @returns userId of signed-in user as ID
 */
export function completeLogin(authCode:string):Promise<string> {
    return new Promise(resolve => {
        const options = {
            method: "POST",
            url: "https://login.microsoftonline.com/" + config.tenantId + "/oauth2/v2.0/token",
            form: {
                grant_type: "authorization_code",
                code: authCode,
                client_id: config.clientId,
                client_secret: config.clientSecret,
                redirect_uri: config.baseUrl + config.redirectUrl
            }
        };
        request(options, async function (error, response, body) {
            if (error) throw new Error(error);
            try {
                const json = JSON.parse(body);
                if (json.error) {
                    console.error("Error occured: " + json.error + "\n" + json.error_description);
                    resolve("");
                }
                else {
                    let newUser = new User(json.access_token);

                    if (!userCache.exists(newUser.id)) {
                        await newUser.init();
                        userCache.set(newUser);
                    }
                    else {
                        let cachedUser = await userCache.get(newUser.id);
                        if (cachedUser) cachedUser.storeToken(json.access_token);
                        else {
                            await newUser.init();
                            userCache.set(newUser);
                        }
                    }
                    if (newUser.id != "") {
                        resolve(newUser.id);
                    }
                    else {
                        console.error("Internal server error when parsing token from login.");
                        resolve("");
                    }
                }
            }
            catch (e) {
                console.error("The token acquirement did not return a JSON. Instead: \n" + body);
                resolve("");
            }
        });
    })

}
