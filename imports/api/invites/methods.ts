import {Meteor} from "meteor/meteor";
import {Invites} from "./invites";
import {Groups} from "/imports/api/groups/groups";

Meteor.methods({
    'insert.invite': async function (groupId) {
        // check if the user has access to the group
        const group = await Groups.findOneAsync({_id: groupId});
        console.log(group?.owner, this.userId, JSON.stringify(group?.members));
        if (group?.owner != this.userId && !group?.members?.includes(this.userId!)) {
            throw new Meteor.Error("not-authorized", "You are not authorized to create an invite for this group.");
        }

        // check if there is already an invite that is not expired for this group
        const existingInvite = await Invites.findOneAsync({
            groupId: groupId,
            expiresAt: {$gt: new Date()}
        });

        if (existingInvite) {
            return `${Meteor.absoluteUrl()}invite/${existingInvite._id}`;
        }

        const inviteId = await Invites.insertAsync({
            groupId: groupId,
            user: Meteor.userId()!,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });

        if (!inviteId) {
            throw new Meteor.Error("invite-not-created", "Failed to create invite.");
        }

        return `${Meteor.absoluteUrl()}invite/${inviteId}`;
    },

    'remove.invite': async function (inviteId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        await Invites.removeAsync(inviteId);
    },

    'get.invite': async function (inviteId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        const invite = await Invites.findOneAsync(inviteId);

        if (!invite) {
            throw new Meteor.Error('invite-not-found');
        }

        if (invite.expiresAt < new Date()) {
            throw new Meteor.Error('invite-expired');
        }

        return invite;
    }
})