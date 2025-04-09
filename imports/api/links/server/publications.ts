import { Meteor } from "meteor/meteor";
import { Links } from "/imports/api/links/links";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Groups } from "/imports/api/groups/groups";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { ReactiveAggregate } from "meteor/tunguska:reactive-aggregate";

dayjs.extend(utc);
dayjs.extend(timezone);

Meteor.publish("links.with.userInfo", async function (groupId, date, timezone) {
  if (!this.userId) {
    throw new Meteor.Error("not-authorized");
  }

  if (!groupId || !date || !timezone) {
    throw new Meteor.Error("Missing arguments");
  }

  // check if the user is a member of the group or the owner
  const group = await Groups.findOneAsync({ _id: groupId });
  if (!group) {
    throw new Meteor.Error("Group not found");
  } else if (group.owner !== this.userId && !group.members?.includes(this.userId)) {
    throw new Meteor.Error("not-authorized");
  }

  const start = dayjs.tz(date, timezone).startOf("day").toDate();
  const end = dayjs.tz(date, timezone).endOf("day").toDate();
  const pipeline = [
    {
      $match: {
        $and: [{ groupId: groupId }, { createdAt: { $gte: start, $lt: end } }],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $project: {
        _id: 1,
        url: 1,
        title: 1,
        description: 1,
        imageLink: 1,
        createdAt: 1,
        userInfo: {
          _id: "$userInfo._id",
          username: "$userInfo.username",
        },
      },
    },
  ];
  ReactiveAggregate(this, Links, pipeline, {
    clientCollection: "linksWithUserInfo",
  });
});

Meteor.publish("links.group.by.domain", async function (groupId) {
  if (!this.userId) {
    throw new Meteor.Error("not-authorized");
  }

  if (!groupId) {
    throw new Meteor.Error("Missing arguments");
  }

  // check if the user is a member of the group or the owner
  const group = await Groups.findOneAsync({ _id: groupId });
  if (!group) {
    throw new Meteor.Error("Group not found");
  } else if (group.owner !== this.userId && !group.members?.includes(this.userId)) {
    throw new Meteor.Error("not-authorized");
  }

  const pipeline = [
    {
      $match: {
        groupId: groupId,
      },
    },
    {
      $addFields: {
        url: {
          $arrayElemAt: [{ $split: [{ $arrayElemAt: [{ $split: ["$url", "//"] }, 1] }, "/"] }, 0],
        },
      },
    },
    {
      $group: {
        _id: "$url",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 }, // (선택) 도메인별로 많은 순서대로 정렬
    },
  ];

  ReactiveAggregate(this, Links, pipeline, {
    clientCollection: "linksByDomain",
  });
});
