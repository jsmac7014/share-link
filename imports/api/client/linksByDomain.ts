import { Mongo } from "meteor/mongo";
type Domain = {
  _id: string;
  count: number;
};

export const LinksByDomain = new Mongo.Collection<Domain>("linksByDomain");
