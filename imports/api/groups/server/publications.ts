import {Meteor} from "meteor/meteor";
import {Groups} from "/imports/api/groups/groups";


Meteor.publish("groups", function () {
    if (!this.userId) {
        // return error
        throw new Meteor.Error("not-authorized");
    }

    console.log(this.userId);

    return Groups.find({$or: [{members: this.userId}, {owner: this.userId}]});
});