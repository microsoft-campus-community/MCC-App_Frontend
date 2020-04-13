import { _DatabaseUser, _User } from "../../models/database/user";
import { userCache } from "../cache/cache";
import { User } from "../cache/cacheDatabases/user";
import { PeopleEngine } from "./engineRequests";


export async function getUserProfile(token:string): Promise<_DatabaseUser> {
	return new Promise(async resolve => {
        const user = await PeopleEngine.getCurrentUser(token);
		//TODO Request to database
		resolve({
			admin: false,
			lead: true,
			position: user.jobTitle,
			name: user.displayName,
			preferredName: "Tobi"
		})
	})
}


export async function getProjectIds(userId:string): Promise<Array<string>> {
	return new Promise(resolve => {
		//TODO Request to database
		resolve([]);
	})
}
export async function getEventIds(userId:string): Promise<Array<string>> {
	return new Promise(resolve => {
		//TODO Request to database
		resolve([]);
	})
}


export async function getCampusId(token:string): Promise<string> {
	return new Promise(resolve => {
		let campusId = "";
		resolve(campusId);
	})
}

export async function createUser(firstName:string, lastName:string, mailAdress:string):Promise<_User> {
	return new Promise(async resolve => {
		//TODO implement request and receice user ID
		let id = "";
		let user = new User(undefined,id);
		userCache.set(await user.init());
		resolve(user);
	})
}
