export interface _PeopleEngineUser {
    isCampusLead: boolean;
    /* isHubLead: boolean; */
    isAdmin: boolean;
    accountEnabled: boolean;
    city: string;
    /* hireDate: string; */
    /* university: string; */
    displayName: string;
    id: string;
    jobTitle: string;
    mail: string;
    location: string;
}

export interface _PeopleEngineCampus {
    id: string;
    displayName: string;
    ext5xtebhdf_mccGroupSettings: {leadId:string};
}
/* 
export interface _PeopleEngineHub {
    name: string;
    lead: string;
    leadName: string;
    aadGroupId: string;
    campus: Array<_PeopleEngineCampus>;
    id: string;
    createdAt: string;
    modifiedAt: string;
    modifiedBy: string;
} */
