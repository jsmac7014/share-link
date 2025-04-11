import { Meteor } from "meteor/meteor";
import { Groups } from "/imports/api/groups/groups";
import { LinkComments } from "/imports/api/link-comments/link-comments";

Meteor.publish("linkComments", async function (linkId: string, groupId: string) {
  if (!this.userId) {
    // return error
    return this.ready();
  }
  // check if user has access to the group
  const group = await Groups.findOneAsync({ _id: groupId });
  if (!group) {
    throw new Meteor.Error("not-found", "Group not found");
  }

  const isOwner = group.owner === this.userId;
  const isMember = group.members?.includes(this.userId);

  if (!isOwner && !isMember) {
    throw new Meteor.Error(
      "not-authorized",
      "You are not authorized to view this group's comments.",
    );
  }

  return LinkComments.find({ linkId: linkId });
});
