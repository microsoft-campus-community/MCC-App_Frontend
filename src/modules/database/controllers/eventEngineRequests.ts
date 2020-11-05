import { IEvent } from "../models/_eventEngine";

export abstract class EventEngine {
    private static baseUrl:string = "https://commasto-api-dev.azurewebsites.net/api/";

    static async createEvent(token: string, toCreate: IEvent):Promise<IEvent>{
        return new Promise(resolve=>{
            resolve(undefined);
        });
    }
}