import express from "express";
import request from "request";

import config from "../../config";
import { userCache } from "../cache/cache";
import { User } from "../cache/cacheDatabases/user";

const apiRouter = express.Router();

apiRouter.get("/login", (req, res) => {
    let state = req.query.origin || "";
    res.redirect(
        //[Tenant ID] Can be replaced by "common" to support multi-tenant login (meaning every person with every Microsoft-Account can log into the app)
        //[Version] Currently v1.0 and v2.0 exist. v1.0 only allows login from organizational accounts, v2.0 allows login from organizational and personal accounts
        "https://login.microsoftonline.com/" + config.tenantId + "/oauth2/v2.0/authorize?" +
        //[client_id] Enter the ID of the enterprise application or application registration you want to use
        "client_id=" + config.clientId +
        //[response_type] Specifies what Active Directory will return after a successful login action. Must at least be "code" for the OAuth 2.0 flow and "id_token" for the OpenIdConnect flow and can have "token" as an additional value
        "&response_type=code" +
        //[redirect_uri] The URL which will be called with the registration code as a query parameter
        "&redirect_uri=" + config.baseUrl + config.redirectUrl +
        //[response_mode] Specifies with which method the code should be returned to the application. Can be query, form_post or fragment
        "&response_mode=query" +
        //[state] The state parameter gets passed through the whole authorization workflow and can be used to store information that is important for your own application
        "&state= " + state +
        //[scope] The scope parameter specifies the permissions that the token received has to call different Microsoft services
        "&scope=" + config.scope
    );
})

apiRouter.get(config.redirectUrl, (req, res) => {
    const authCode = req.query.code;
    if (!authCode) {
        res.status(500).send("There was no authorization code provided in the query. No Bearer token can be requested");
        return;
    }
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
            if (json.error) res.status(500).send("Error occured: " + json.error + "\n" + json.error_description);
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
                    if (req.session) req.session.session = newUser.id;
                    //res.cookie("session", userId, {httpOnly: true, signed:true});
                    req.query.state ? res.redirect(req.query.state) : res.redirect("/");
                }
                else res.status(500).send("Server screwed up! :/");
            }
        }
        catch (e) {
            res.status(500).send("The token acquirement did not return a JSON. Instead: \n" + body);
        }
    });
});

export default apiRouter;
