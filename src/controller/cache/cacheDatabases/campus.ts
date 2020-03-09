import { _Campus } from "../../../models/database/campus";
import { _User } from "../../../models/database/user";
import { _Cache } from "../../../models/cache/cache"; 

class CampusCache implements _Cache<CampusCache,_Campus> {
	private dataMap: {[key:string]:_Campus};
	private campusNames: Array<string>;

	constructor() {
		this.dataMap = {
			"1": new Campus({ id: "", name: "Munich", leadId: "", memberIds: [""] }),
			"2": new Campus({ id: "", name: "Munich", leadId: "", memberIds: [""] }),
			"3": new Campus({ id: "", name: "Munich", leadId: "", memberIds: [""] }),
			"4": new Campus({ id: "", name: "Munich", leadId: "", memberIds: [""] }),
			"5": new Campus({ id: "", name: "Munich", leadId: "", memberIds: [""] })
		}

		this.campusNames = [];
	}

	set(campusObj: _Campus):Promise<boolean> {
		//TODO
		return new Promise(resolve => {
			this.dataMap[campusObj.id] = campusObj;
			resolve(true);
		})
		
	}
	getCampusNames(): Array<string> {
		if (this.campusNames === []) {
			for(const key in this.dataMap) {
				this.campusNames.push(this.dataMap[key].name);
			}
		}
		return this.campusNames;
	}
	async get(campusId: string): Promise<_Campus | undefined> {
		return new Promise(resolve => {
			//TODO load campus from database
			resolve(this.dataMap[campusId]);
		})
	}
	init():Promise<CampusCache> {
		return new Promise(resolve => {
			//TODO get all campus
		})
	}
	clear() {
		return;
	}
}

class Campus implements _Campus {
	id: string;
	name: string;
	leadId: string;
	memberIds: Array<string>;
	members: Array<_User>;
	eventIds: Array<string>;

	constructor(campusObj: { [key: string]: any }) {
		this.id = campusObj.id;
		this.name = campusObj.name;
		this.leadId = campusObj.leadId;
		this.memberIds = [];
		this.eventIds = [];
		this.members = [];
		

	}
	async init():Promise<void> {
		return new Promise(async resolve => {
			let values = await Promise.all([
				this.getMemberIds()
			]);
			this.memberIds = values[0];
		})
	}
	async getMemberIds(): Promise<Array<string>> {
		return new Promise(resolve => {
			resolve([]);
		})
	}
}

export default CampusCache;