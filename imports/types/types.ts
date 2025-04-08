export type Group = {
    _id?: string;
    name: string;
    description?: string;
    owner: string;
    members?: string[];
    createdAt: Date;
}
export type Link = {
    _id?: string;
    url: string;
    title: string;
    description?: string;
    imageLink?: string;
    groupId: string;
    owner: string;
    createdAt: Date;
}
export type Invite = {
    _id?: string;
    groupId: string;
    user: string;
    createdAt: Date;
    expiresAt: Date;
}
export type GroupDetail = {
    _id?: string;
    name: string;
    description?: string;
    owner: string;
    members?: string[];
    createdAt: Date;
    ownerInfo: {
        _id: string;
        name: string;
        username: string;
    }
}

