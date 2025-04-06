import {Meteor} from "meteor/meteor";
import {Invites} from "./invites";

Meteor.methods({
    async 'invites.insert'(groupId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        return Invites.insertAsync({
            groupId: groupId,
            user: Meteor.userId(),
            createdAt: new Date(),
            expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
        });
    },

    async 'invites.remove'(inviteId) {
        if (!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }
        await Invites.removeAsync(inviteId);
    },

    async 'invites.get'(inviteId) {
        if(!Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
        }

        const invite = await Invites.findOneAsync(inviteId);

        if (!invite) {
            throw new Meteor.Error('invite-not-found');
        }

        if (invite.expiredAt < new Date()) {
            throw new Meteor.Error('invite-expired');
        }

        return invite;
    }
})