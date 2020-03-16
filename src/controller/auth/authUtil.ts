import request from "request";
import config from "../../config";

export let systemTokenCache:string = "";

export async function getSystemToken():Promise<string> {
	return new Promise(resolve => {
		const options = {
			method: "POST",
			url: "https://login.microsoftonline.com/" + config.tenantId + "/oauth2/v2.0/token",
			form: {
				grant_type: "client_credentials",
				client_id: config.clientId,
				client_secret: config.clientSecret,
				scope: "https://graph.microsoft.com/.default"
			}
		};
		request(options, (error, response, body) => {
			if(error) throw "No system token returned! Error: "+error;
			if(typeof body === "string") body = JSON.parse(body);
			let token = body.access_token;
			systemTokenCache = token;
			resolve(systemTokenCache);
		})
	})
	
}