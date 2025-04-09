import { Meteor } from "meteor/meteor";
import { Groups } from "/imports/api/groups/groups";
import { check } from "meteor/check";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ReactiveAggregate } from "meteor/tunguska:reactive-aggregate";

Meteor.publish("groups", function () {
  if (!this.userId) {
    // return error
    return this.ready();
  }

  return Groups.find({ $or: [{ members: this.userId }, { owner: this.userId }] });
});

Meteor.publish("group.detail", function (groupId: string) {
  check(groupId, String);
  if (!this.userId) {
    // return error
    return this.ready();
  }
  const pipeline = [
    { $match: { _id: groupId } },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerInfo",
      },
    },
    {
      $unwind: "$ownerInfo",
    },
    {
      $project: {
        _id: 1,
        name: 1,
        description: 1,
        members: 1,
        createdAt: 1,
        // Include owner information as object
        ownerInfo: {
          _id: "$ownerInfo._id",
          name: "$ownerInfo.name", // Assuming the field is 'name'
          username: "$ownerInfo.username", // Assuming the field is 'username'
        },
      },
    },
  ];

  ReactiveAggregate(this, Groups, pipeline, {
    clientCollection: "groupDetail",
  });
});
