import request, { UrlOptions, CoreOptions } from "request";
import { getSystemToken } from "../../api/controller/auth/authUtil";
import { _PeopleEngineUser, _PeopleEngineCampus, _PeopleEngineHub } from "../models/_peopleEngine";
import { userCache } from "../../cache/controller/cache";
import { User } from "../../cache/controller/cacheDatabases/user";



export abstract class PeopleEngine {
    //TODO Define dev and production endpoint
    private static baseUrl:string = "https://commasto-api-dev.azurewebsites.net/api/";

        static async getAllUsers():Promise<Array<_PeopleEngineUser>> {
            let token = await getSystemToken();
            return this.requestEngineArray("users?scope=full",token);
        }
        static async getUserById(id:string):Promise<_PeopleEngineUser|undefined> {
            let token = await getSystemToken();
            return this.requestEngineItem("users/"+id+"?scope=full",token);
        }

    //Must be done through delegated for audit reasons!
    static async createUser(token:string,body:{[key:string]:any}):Promise<_PeopleEngineUser> {
        return new Promise(async resolve => {
            let user = await this.requestEngineItem("users",token,"POST",body);
            let userObj = new User(undefined,user.id);
            userObj.fromJson(user);
            userCache.set(userObj);
            resolve(user);
        })
    }
    static async getCurrentUser(token:string):Promise<_PeopleEngineUser|undefined> {
        return this.requestEngineItem("users/current?scope=full",token);
    }
    static async getCurrentUserCampus(token:string):Promise<_PeopleEngineCampus> {
        return this.requestEngineItem("hubs/campus/my",token);
    }
    static async getCurrentUserHub(token:string):Promise<_PeopleEngineHub> {
        return this.requestEngineItem("hubs/my",token);
    }

    static async getAllHubs(token:string):Promise<Array<_PeopleEngineHub>> {
        return this.requestEngineArray("hubs",token);
    }
    static async getHub(hubId:string):Promise<_PeopleEngineHub> {
        let token = await getSystemToken();
        return this.requestEngineItem("hubs/"+hubId,token);
    }
    static async getAllCampusInHub(hubId:string):Promise<Array<_PeopleEngineCampus>> {
        let token = await getSystemToken();
        return this.requestEngineArray("hubs/"+hubId+"/campus",token);
    }

    static async getAllCampus():Promise<Array<_PeopleEngineCampus>> {
        let token = await getSystemToken();
        return this.requestEngineArray("hubs/campus",token);
    }
    static async getCampus(campusId:string):Promise<_PeopleEngineCampus> {
        let token = await getSystemToken();
        //Hub ID is not relevant for the query (as of API specification of People Engine)
        return this.requestEngineItem("hubs/l0l/campus/"+campusId,token);
    }
    static async getAllCampusMembers(hubId:string, campusId:string):Promise<Array<_PeopleEngineUser>> {
        let token = await getSystemToken();
        return this.requestEngineArray("hubs/"+hubId+"/campus/"+campusId+"/users",token);
    }

    //Utility functions
    private static async requestEngineItem(database:string, token?:string, method?:string, body?:{[key:string]:any}):Promise<any> {
        return new Promise(async resolve => {
            resolve((await this.requestEngineArray(database,token,method,body))[0]);
        })

    }
    private static async requestEngineArray(database:string, token?:string, method?:string, body?:{[key:string]:any}):Promise<Array<any>> {
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
            if(body) {
                options.body = JSON.stringify(body);
                if(options.headers) options.headers["Content-Type"] = "application/json";
            }

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
