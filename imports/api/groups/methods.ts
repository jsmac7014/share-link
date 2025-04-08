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
        const group = Groups.rawCollection();
        const pipeline = [
            {$match: {_id: groupId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'ownerInfo'
                }
            }, {
                $unwind: '$ownerInfo'
            }, {
                $project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    // Include owner information as object
                    ownerInfo: {
                        _id: '$ownerInfo._id',
                        name: '$ownerInfo.name', // Assuming the field is 'name'
                        username: '$ownerInfo.username', // Assuming the field is 'username'
                    }
                }
            }
        ];

        if (!group) {
            throw new Meteor.Error("group-not-found", "Group not found.");
        }

        return await group.aggregate(pipeline).toArray();
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
        if (currentGroup?.owner !== this.userId) {
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
        if (currentGroup?.owner == this.userId) {
            throw new Meteor.Error("not-authorized", "You cannot add owner as member.");
        }
        // check if the user is already a member
        if (currentGroup?.members?.includes(this.userId)) {
            throw new Meteor.Error("user-already-member", "User is already a member of this group.");
        }

        // Add the member to the group
        Groups.updateAsync(groupId, {$addToSet: {members: this.userId}});
    },
    "groups.leave": async function (groupId: string, userId: string) {
        check(groupId, String);
        check(userId, String);

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to remove members from a group.");
        }

        // check if the user is the owner of the group or the member who is leaving
        const currentGroup = await Groups.findOneAsync(groupId);
        if (currentGroup?.owner == this.userId) {
            throw new Meteor.Error("not-authorized", "You cannot leave the group as owner.");
        } else if (this.userId !== userId) {
            throw new Meteor.Error("not-authorized", "You are not authorized to remove this member.");
        }

        // check if the user is already a member
        if (!currentGroup?.members?.includes(userId)) {
            throw new Meteor.Error("user-not-member", "User is not a member of this group.");
        }

        // Remove the member from the group
        Groups.updateAsync(groupId, {$pull: {members: userId}});
    }
})