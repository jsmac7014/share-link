import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import type { Link } from "/imports/types/types";

export const Links = new Mongo.Collection<Link>('links');

export const LinksSchema = new SimpleSchema({
    url: String,
    title: String,
    description: String,
    groupId: String,
    imageLink: String,
    owner: String,
    createdAt: Date
});