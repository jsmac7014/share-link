import { Mongo } from "meteor/mongo";
import { LinkWithUserInfo } from "/imports/types/types";

export const LinksWithUserInfo = new Mongo.Collection<LinkWithUserInfo>("linksWithUserInfo");
