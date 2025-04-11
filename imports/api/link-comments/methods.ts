import { Meteor } from "meteor/meteor";
import { LinkComments } from "/imports/api/link-comments/link-comments";
import { check } from "meteor/check";
import { LinkComment } from "/imports/types/types";
import { Groups } from "/imports/api/groups/groups";

Meteor.methods({
  "insert.linkComment": async function (linkId: string, groupId: string, text: string) {
    check(linkId, String);
    check(text, String);

    // check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to add a comment.");
    }

    // check if this user has access to the group
    const group = await Groups.findOneAsync({ _id: groupId });
    if (!group) {
      throw new Meteor.Error("not-found", "Group not found");
    }
    const isOwner = group.owner === this.userId;
    const isMember = group.members?.includes(this.userId);

    if (!isOwner && !isMember) {
      throw new Meteor.Error("not-authorized", "You must have access to group to add a comment.");
    }

    // Insert the comment into the LinkComments collection
    const currentUser = await Meteor.users.findOneAsync(this.userId);
    if (!currentUser) {
      throw new Meteor.Error("not-found", "User not found");
    }

    const comment: LinkComment = {
      linkId: linkId,
      userInfo: {
        _id: this.userId,
        username: currentUser.username!,
      },
      text: text,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await LinkComments.insertAsync(comment);
  },
});
