export interface _Cache<Cache,Database>{
    dataMap: { [key: string]: Database };

	get(id:string): Promise<Database | undefined>;
	set(item:Database): Promise<boolean>;
	clear():void;
    init():Promise<Cache>;
    refresh():void;
    exists(id:string):boolean;
}
