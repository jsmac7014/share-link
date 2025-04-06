import {Meteor} from "meteor/meteor";
import {Groups} from "/imports/api/groups/groups";
import {check} from "meteor/check";
import {Group} from "/imports/types/types";

Meteor.methods({
    // get users groups
    "groups.getUserGroups": function (userId: string) {
        check(userId, String);

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to view your groups.");
        }

        // Find groups that the user is a member or the owner of
        return Groups.find({$or: [{members: userId}, {owner: userId}]}).fetch();
    },

    // Get Groups details
    "groups.get": async function (groupId: string) {
        check(groupId, String);
        console.log("Group ID:", groupId);
        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to view group details.");
        }

        // Find the group by ID
        const group = await Groups.findOneAsync(groupId);
        if (!group) {
            throw new Meteor.Error("group-not-found", "Group not found.");
        }

        return group;
    },
    "groups.insert": async function (group: Group) {
        check(group, {
            name: String,
            description: String,
            owner: String,
            members: [String],
            createdAt: Date
        });

        // Insert the new group into the database
        return Groups.insertAsync(group);
    },
    "groups.update": async function (groupId: string, group: Partial<Group>) {
        check(groupId, String);
        check(group, {
            name: String,
            description: String,
        });

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to update group details.");
        }

        // check if the user is the owner of the group
        const currentGroup = await Groups.findOneAsync(groupId);
        if(currentGroup?.owner !== this.userId) {
            throw new Meteor.Error("not-authorized", "You are not authorized to update this group.");
        }

        // Update the group in the database
        return Groups.updateAsync(groupId, {$set: group});
    },
    "groups.addMember": async function (groupId: string) {
        check(groupId, String);

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to add members to a group.");
        }

        const currentGroup = await Groups.findOneAsync(groupId);

        // check if the user is the owner of the group
        // you cannot add owner as member
        console.log(currentGroup?.owner == this.userId);
        if(currentGroup?.owner == this.userId) {
            throw new Meteor.Error("not-authorized", "You cannot add owner as member.");
        }
        // check if the user is already a member
        if (currentGroup?.members?.includes(this.userId)) {
            throw new Meteor.Error("user-already-member", "User is already a member of this group.");
        }

        // Add the member to the group
        Groups.updateAsync(groupId, {$addToSet: {members: this.userId}});
    }
})