import { Mongo } from 'meteor/mongo';
import type { Link } from "/imports/types/types";

export const Links = new Mongo.Collection<Link>('links');