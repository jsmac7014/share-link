import { Mongo } from 'meteor/mongo';
import {Invite} from "/imports/types/types";

export const Invites = new Mongo.Collection<Invite>('invites');
