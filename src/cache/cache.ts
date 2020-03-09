import uCache from "./cacheDatabases/user";
import cCache from "./cacheDatabases/campus";
import pCache from "./cacheDatabases/project";



//TODO change cache to init first and then return
export const userCache = new uCache();
export const campusCache = new cCache();
export const projectCache = new pCache();