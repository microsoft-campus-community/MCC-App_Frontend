import { _DatabaseUser, _User } from "../../models/database/user";
import { userCache } from "../cache/cache";
import { User } from "../cache/cacheDatabases/user";


export async function getUserProfile(userId:string): Promise<_DatabaseUser> {
	return new Promise(resolve => {
		//TODO Request to database
		resolve({
			admin: false,
			lead: true,
			position: "Campus Lead",
			name: "Tobias Urban",
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


export async function getCampusId(userId:string): Promise<string> {
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