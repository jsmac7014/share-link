export type Group = {
  _id?: string;
  name: string;
  description?: string;
  owner?: string;
  members?: string[];
  hidden?: boolean;
  pin?: string[];
  createdAt: Date;
};
export type Link = {
  _id?: string;
  url: string;
  title: string;
  description?: string;
  imageLink?: string;
  groupId: string;
  owner: string;
  createdAt: Date;
};
export type Invite = {
  _id?: string;
  groupId: string;
  user: string;
  createdAt: Date;
  expiresAt: Date;
};
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
  };
};
export type LinkWithUserInfo = {
  _id?: string;
  url: string;
  title: string;
  description?: string;
  imageLink?: string;
  groupId: string;
  owner: string;
  createdAt: Date;
  userInfo: {
    _id: string;
    name: string;
    username: string;
  };
};
export type LinkComment = {
  _id?: string;
  linkId: string;
  userInfo: {
    _id: string;
    username: string;
  };
  text: string;
  createdAt: Date;
  updatedAt: Date;
};
