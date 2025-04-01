import {Meteor} from "meteor/meteor";
import {Groups} from "/imports/api/groups/groups";
import {check} from "meteor/check";

Meteor.methods({
    // get users groups
    "groups.getUserGroups": function (userId) {
        check(userId, String);

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to view your groups.");
        }

        // Find groups that the user is a member of
        return Groups.find({members: userId}).fetch();
    },

    // Get Groups details
    "groups.get": function (groupId) {
        check(groupId, String);

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to view group details.");
        }

        // Find the group by ID
        const group = Groups.findOne({_id: groupId});
        if (!group) {
            throw new Meteor.Error("group-not-found", "Group not found.");
        }

        return group;
    },
    "groups.insert": async function (group) {
        check(group, {
            name: String,
            description: String,
            owner: String,
            members: [String],
            createdAt: Date
        });

        // Check if the group already exists
        const existingGroup = await Groups.findOneAsync({name: group.name});
        if (existingGroup) {
            throw new Meteor.Error("group-exists", "A group with this name already exists.");
        }

        // Insert the new group into the database
        return Groups.insertAsync(group);
    }
})