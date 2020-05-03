import { _User } from "./user";
import { _Campus } from "./campus";

export interface _Hub {
    name:string;
    lead:_User;
    id:string;
    campus:Array<_Campus>;

    init():Promise<void>;
}
