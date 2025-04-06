import { Mongo } from 'meteor/mongo';
import type { Group } from "/imports/types/types";

export const Groups = new Mongo.Collection<Group>('groups');