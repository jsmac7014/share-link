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
