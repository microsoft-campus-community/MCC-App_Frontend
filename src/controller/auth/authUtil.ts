import request from "request";
import config from "../../config";

let systemToken:string = "";
let refreshTimeStamp:number = new Date().getTime();

export async function getSystemToken():Promise<string> {
	return new Promise(resolve => {
        if(systemToken && new Date().getTime() - refreshTimeStamp < 60 * 60 * 1000) {
            resolve(systemToken);
            return;
        }
		const options = {
			method: "POST",
			url: "https://login.microsoftonline.com/" + config.tenantId + "/oauth2/v2.0/token",
			form: {
				grant_type: "client_credentials",
				client_id: config.clientId,
				client_secret: config.clientSecret,
				scope: "https://campus-community.org/api/.default"
			}
		};
		request(options, (error, response, body) => {
			if(error) throw "No system token returned! Error: "+error;
			if(typeof body === "string") body = JSON.parse(body);
			let token = body.access_token;
            systemToken = token;
            refreshTimeStamp = new Date().getTime();
			resolve(systemToken);
		})
	})

}
