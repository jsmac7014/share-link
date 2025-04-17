import { Mongo } from "meteor/mongo";
import type { Group } from "/imports/types/types";
import SimpleSchema from "simpl-schema";

export const Groups = new Mongo.Collection<Group>("groups");
export const groupValidatorContext = new SimpleSchema({
  name: {
    type: String,
    required: true,
    max: 50,
    min: 1,
  },
  description: {
    type: String,
    required: true,
    max: 100,
    min: 1,
  },
  owner: {
    type: String,
    required: true,
  },
  members: {
    type: Array,
    required: false,
  },
  "members.$": {
    type: String,
  },
  hidden: {
    type: Boolean,
    required: false,
  },
  pin: {
    type: Array,
    required: false,
  },
  "pin.$": {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    defaultValue: new Date(),
  },
}).newContext();
