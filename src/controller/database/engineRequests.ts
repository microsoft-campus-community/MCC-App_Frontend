import request, { UrlOptions, CoreOptions } from "request";
import { getSystemToken } from "../auth/authUtil";
import { _PeopleEngineUser, _PeopleEngineCampus, _PeopleEngineHub } from "../../models/database/engines";



export abstract class PeopleEngine {
    private static baseUrl:string = "https://commasto-api-dev.azurewebsites.net/api/";

    static async getAllUsers(token:string):Promise<Array<_PeopleEngineUser>> {
        return this.requestEngine("users",token);
    }
    static async createUser(token:string,body:{[key:string]:any}):Promise<_PeopleEngineUser> {
        return new Promise(async resolve => {
            let user = await this.requestEngineItem("users",token,"POST",body);
            resolve(user);
        })
    }
    static async getCurrentUser(token:string):Promise<_PeopleEngineUser> {
        return this.requestEngineItem("users/current",token);
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
    static async getHub(token:string, hubId:string):Promise<_PeopleEngineHub> {
        return this.requestEngineItem("hubs/"+hubId,token);
    }
    static async getAllCampusInHub(token:string,hubId:string):Promise<Array<_PeopleEngineCampus>> {
        return this.requestEngine("hubs/"+hubId+"/campus",token);
    }

    static async getAllCampus(token:string):Promise<Array<_PeopleEngineCampus>> {
        return this.requestEngine("hubs/campus",token);
    }
    static async getCampus(token:string, hubId:string, campusId:string):Promise<_PeopleEngineCampus> {
        return this.requestEngineItem("hubs/"+hubId+"/campus/"+campusId,token);
    }
    static async getAllCampusMembers(token:string, hubId:string, campusId:string):Promise<Array<_PeopleEngineUser>> {
        return this.requestEngine("hubs/"+hubId+"/campus/"+campusId+"/users",token);
    }





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
                if(error) console.error(error);
                let payload = JSON.parse(body);
                if (Array.isArray(payload)) resolve(payload);
                else resolve([payload]);
            })
        })
    }
}
