import request, { UrlOptions, CoreOptions } from "request";
import { getSystemToken } from "../auth/authUtil";
import { _PeopleEngineUser, _PeopleEngineCampus, _PeopleEngineHub } from "../../models/database/engines";



export abstract class PeopleEngine {
    private static baseUrl:string = "https://commasto-api-dev.azurewebsites.net/api/";

    static async getAllUsers():Promise<Array<_PeopleEngineUser>> {
        let token = await getSystemToken();
        return this.requestEngine("users?scope=full",token);
    }
    static async getUserById(id:string):Promise<_PeopleEngineUser> {
        let token = await getSystemToken();
        return this.requestEngineItem("users/"+id,token);
    }

    //Must be done through delegated for audit reasons!
    static async createUser(token:string,body:{[key:string]:any}):Promise<_PeopleEngineUser> {
        return new Promise(async resolve => {
            let user = await this.requestEngineItem("users",token,"POST",body);
            resolve(user);
        })
    }
    static async getCurrentUser(token:string):Promise<_PeopleEngineUser> {
        return this.requestEngineItem("users/current?scope=full",token);
    }
    static async getCurrentUserCampus(token:string):Promise<_PeopleEngineCampus> {
        return this.requestEngineItem("hubs/campus/my",token);
    }
    static async getCurrentUserHub(token:string):Promise<_PeopleEngineHub> {
        return this.requestEngineItem("hubs/my",token);
    }

    static async getAllHubs(token:string):Promise<Array<_PeopleEngineHub>> {
        return this.requestEngine("hubs",token);
    }
    static async getHub(hubId:string):Promise<_PeopleEngineHub> {
        let token = await getSystemToken();
        return this.requestEngineItem("hubs/"+hubId,token);
    }
    static async getAllCampusInHub(hubId:string):Promise<Array<_PeopleEngineCampus>> {
        let token = await getSystemToken();
        return this.requestEngine("hubs/"+hubId+"/campus",token);
    }

    static async getAllCampus():Promise<Array<_PeopleEngineCampus>> {
        let token = await getSystemToken();
        return this.requestEngine("hubs/campus",token);
    }
    static async getCampus(campusId:string):Promise<_PeopleEngineCampus> {
        let token = await getSystemToken();
        //Hub ID is not relevant for the query (as of API specification of People Engine)
        return this.requestEngineItem("hubs/l0l/campus/"+campusId,token);
    }
    static async getAllCampusMembers(hubId:string, campusId:string):Promise<Array<_PeopleEngineUser>> {
        let token = await getSystemToken();
        return this.requestEngine("hubs/"+hubId+"/campus/"+campusId+"/users",token);
    }

    //Utility functions
    private static async requestEngineItem(database:string, token?:string, method?:string, body?:{[key:string]:any}):Promise<any> {
        return new Promise(async resolve => {
            resolve((await this.requestEngine(database,token,method,body))[0]);
        })

    }
    private static async requestEngine(database:string, token?:string, method?:string, body?:{[key:string]:any}):Promise<Array<any>> {
        return new Promise(async resolve => {
            const endpoint = this.baseUrl + database;

            const options:(UrlOptions & CoreOptions) = {
                url: endpoint,
                method: "GET",
                headers: {
                    Authorization: "Bearer "+token
                }
            };
            if(!token && options.headers) options.headers.Authorization = "Bearer " + await getSystemToken();
            if(method) options.method = method;
            if(body) options.body = body;

            request(options,(error,response,body) => {
                if(error || (response.statusCode > 299 || response.statusCode < 200)) {
                    console.error(error);
                    resolve([]);
                    return;
                }
                let payload = JSON.parse(body);
                if (Array.isArray(payload)) resolve(payload);
                else resolve([payload]);
            })
        })
    }
}
