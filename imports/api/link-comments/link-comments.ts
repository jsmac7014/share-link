import { Mongo } from "meteor/mongo";
import { LinkComment } from "/imports/types/types";
export const LinkComments = new Mongo.Collection<LinkComment>("linkComments");
