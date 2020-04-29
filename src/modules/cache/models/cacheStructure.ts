export interface _Cache<Cache,Database>{

	get(id:string): Promise<Database | undefined>;
	set(item:Database): Promise<boolean>;
	clear():void;
    init():Promise<Cache>;
    refresh():void;
}
