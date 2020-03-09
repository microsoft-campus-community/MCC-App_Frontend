export interface _Campus {
	id: string;
	name: string;
	leadId: string;
	memberIds:Array<string>;
	members:Array<{[key:string]:any}>;
	eventIds:Array<string>;
}