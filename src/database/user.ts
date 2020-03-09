import { _DatabaseUser } from "../models/database/user";


export async function getUserProfile(userId:string): Promise<_DatabaseUser> {
	return new Promise(resolve => {
		//TODO Request to database
		resolve({
			admin: false,
			lead: true,
			position: "Campus Lead"
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