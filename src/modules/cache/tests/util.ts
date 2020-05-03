import request from "request";
import dotenv from "dotenv";
export async function getTokenFromUser(): Promise<string> {
    dotenv.config();
    return new Promise(resolve => {
        if (!process.env.TESTUSERNAME || !process.env.TESTUSERSECRET) throw "Credentials for test user are not defined!";
        request({
            url: "https://login.microsoftonline.com/" + process.env.TENANT_ID + "/oauth2/v2.0/token",
            headers: {
                "Content-Type": "x-www-form-urlencoded"
            },
            method: "POST",
            form: {
                client_id: process.env.TESTCLIENT_ID,
                client_secret: process.env.TESTCLIENT_SECRET,
                scope: "user.read",
                username: process.env.TESTUSERNAME,
                password: process.env.TESTUSERSECRET,
                grant_type: "password",
            }
        }, (error, response, body) => {
            const json = JSON.parse(body);
            if (json.error) {
                throw("Error occured: " + json.error + "\n" + json.error_description);
            }
            else {
                resolve(json.access_token);
            }
        })
    })
}
