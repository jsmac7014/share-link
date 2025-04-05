import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import type { Group } from "/imports/types/types";

export const Groups = new Mongo.Collection<Group>('groups');

export const GroupsSchema = new SimpleSchema({
    title: String,
    description: String,
    owner: String,
    members: {
        type: Array,
        optional: true,
    },
    'members.$': {
        type: String,
    },
    createdAt: Date
});