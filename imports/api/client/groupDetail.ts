import { Mongo } from "meteor/mongo";
import { GroupDetail as GroupDetailType } from "/imports/types/types";

export const GroupDetail = new Mongo.Collection<GroupDetailType>("groupDetail");
