import { _Campus } from "./campus";
import { _Project } from "./project";

export interface _User {
	name: string;
	campus: _Campus;
	preferredName: string;
	projectCount: number;
	eventCount: number;
	position: string;
	projects: Array<_Project>;
	eventIds: Array<string>;
	id: string;
	token: string;
	userInformation?: _AADToken;
	admin: boolean;
	lead: boolean;
	init():Promise<_User>;
}

export interface _DatabaseUser {
	admin: boolean;
	lead: boolean;
	position: string;
	name: string;
	preferredName: string;
}

export interface _AADToken {

	acct: number;
	acr: string;
	aio: string;
	amr: Array<string>;
	app_displayname: string;
	appid: string;
	appidacr: string;
	aud: string;
	exp: number;
	family_name: string;
	given_name: string;
	iat: number;
	ipaddr: string;
	iss: string;
	name: string;
	nbf: number;
	oid: string;
	platf: string;
	puid: string;
	scp: Array<string>;
	signin_state: Array<string>;
	sub: string;
	tid: string;
	unique_name: string;
	upn: string;
	uti: string;
	ver: string;
	wids: Array<string>
	xms_st: { [key: string]: any }
	xms_tcdt: number
}