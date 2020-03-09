import { _User } from "./user";
import { _Campus } from "./campus";

export interface _Project {
	id:string;
	members:Array<_User>;
	campus:Array<_Campus>;
	completed: boolean;
	init():Promise<_Project>;
}