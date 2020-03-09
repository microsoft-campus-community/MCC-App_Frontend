import { _User } from "../../models/database/user";
import { _Campus } from "../../models/database/campus";
import { _Cache } from "../../models/cache/cache";
import { userCache } from "../cache";

class ProjectCache implements _Cache<ProjectCache,Project>, _CacheDatabase<ProjectCache> {

	//TODO Swap with interface
	private projectMap:{[id:string]:Project};
	

	constructor() {
		this.projectMap = {};
		
	}

	init():Promise<ProjectCache> {
		return new Promise(async resolve => {
			let projects = await this.getUpcomingProjects();
			projects.forEach(async project => {
				this.projectMap[project.id] = await project.init();
			})
		})
	}

	getUpcomingProjects():Promise<Array<Project>> {
		return new Promise(resolve => {
			//TODO
			resolve([]);
		})
	}
	set(item:Project):Promise<boolean> {
		return new Promise(async resolve => {
			this.projectMap[item.id] = await item.init();
		})
	}
	get(id:string):Promise<Project | undefined> {
		return new Promise(resolve => {
			resolve(this.projectMap[id])
		})
	}
	clear():void {
		for (const key in this.projectMap) {
			if(this.projectMap[key].completed) delete this.projectMap[key];
		}
	}

	
}

export class Project implements _CacheDatabase<Project> {
	id:string;
	members:Array<_User>;
	campus:Array<_Campus>;
	completed: boolean;

	constructor(projectId: string) {
		this.id = projectId;
		this.members = [];
		this.campus = [];
		this.completed = false;
		}

		async init():Promise<Project> {
			return new Promise(async resolve => {
				if(this.members !== [] && this.campus !== []) { resolve(this); return};
				let memberIds = await this.getMemberIds();
				let campus:Array<_Campus> = [];
				memberIds.forEach(async memberId => {
					let member = await userCache.get(memberId);
					if(!member) {
						console.error("Member "+member+" not found in database on initializing project!")
						return;
					}
					this.members.push(member);
					//TODO change to member.campus
					//if(!campus.includes(member.campusId)) campus.push(member.campusId);
				})
				this.campus = campus;
			})
		}
		async getMemberIds():Promise<string[]> {
			return new Promise(resolve => {
				//TODO database get member IDs by project ID
				resolve([]);
			})
		}
	}

export default ProjectCache;