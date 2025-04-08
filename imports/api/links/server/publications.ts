import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Groups} from "/imports/api/groups/groups";
// @ts-ignore
import {ReactiveAggregate} from 'meteor/tunguska:reactive-aggregate';

dayjs.extend(utc);
dayjs.extend(timezone);

Meteor.publish("links.with.userInfo", async function (groupId, date, timezone) {
    if(!this.userId) {
        throw new Meteor.Error("not-authorized");
    }

    if (!groupId || !date || !timezone) {
        throw new Meteor.Error("Missing arguments");
    }

    // check if the user is a member of the group or the owner
    const group = await Groups.findOneAsync({_id: groupId});
    if (!group) {
        throw new Meteor.Error("Group not found");
    } else if (group.owner !== this.userId && !group.members?.includes(this.userId)) {
        throw new Meteor.Error("not-authorized");
    }

    const start = dayjs.tz(date, timezone).startOf('day').toDate();
    const end = dayjs.tz(date, timezone).endOf('day').toDate();
    const pipeline = [
        {
            $match: {
                $and: [
                    {groupId: groupId},
                    {createdAt: {$gte: start, $lt: end}}
                ]
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "userInfo"
            }
        },
        {
            $unwind: "$userInfo"
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
                }
            }
        }
    ]
    console.log("Publishing links.with.userInfo", groupId, date, timezone); // 로그 확인
    ReactiveAggregate(this, Links, pipeline, {
        clientCollection: "linksWithUserInfo",
    })


})

