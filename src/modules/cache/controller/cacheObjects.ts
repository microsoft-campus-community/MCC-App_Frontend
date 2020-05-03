import { UserCache } from "./cacheDatabases/user";
import { CampusCache } from "./cacheDatabases/campus";
import { HubCache } from "./cacheDatabases/hub";
//import pCache from "./cacheDatabases/project";

//TODO change cache to init first and then return
export const userCache = new UserCache();
export const campusCache = new CampusCache();
export const hubCache = new HubCache();
//export const projectCache = new pCache();
