import request from "request";
import dotenv from "dotenv";


export async function getAllCampus(): Promise<string> {
    return new Promise(async resolve => {
        let token = await getTestToken();
        request("https://graph.microsoft.com/v1.0/groups?$filter=startsWith(displayName,'Campus')&$select=id", {
            headers: {
                "Authorization": "Bearer " + token
            }
        }, (error, response, body) => {
            resolve(body);
        })
})
}
export async function getGraphUserFromToken(token:string):Promise<string> {
    return new Promise(resolve => {
        request("https://graph.microsoft.com/v1.0/me", {
        headers: {
            Authorization: "Bearer " + token
        }
    }, (error,response,body) => {
        resolve(body);
    })
    })
}

export async function getUserTokenForAPI(): Promise<string> {
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
                scope: "https://campus-community.org/Api/Default.ReadWrite",
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
export async function getUserTokenForGraph(): Promise<string> {
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
async function getTestToken(): Promise<string> {
    dotenv.config();
    return new Promise(resolve => {
        const options = {
            method: "POST",
            url: "https://login.microsoftonline.com/" + process.env.TENANT_ID + "/oauth2/v2.0/token",
            form: {
                grant_type: "client_credentials",
                client_id: process.env.TESTCLIENT_ID,
                client_secret: process.env.TESTCLIENT_SECRET,
                scope: "https://graph.microsoft.com/.default"
            }
        };
        request(options, (error, response, body) => {
            if (error) throw "No system token returned! Error: " + error;
            if (typeof body === "string") body = JSON.parse(body);
            resolve(body.access_token);
        })
    })
}
