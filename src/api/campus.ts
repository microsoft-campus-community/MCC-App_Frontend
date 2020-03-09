import {campusCache} from "../cache/cache";

export function getCampusNames():Array<string> {
	return campusCache.getCampusNames();
}