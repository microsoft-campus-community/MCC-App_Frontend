import { _User } from "./user";

export interface _Campus {
	id: string;
	name: string;
	leadId: string;
	memberIds:Array<string>;
	members:Array<_User>;

    init(): Promise<void>;
    isUserPartOfCampus(userId:string):Promise<_Campus|undefined>;
}
