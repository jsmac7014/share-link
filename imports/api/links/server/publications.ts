import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Groups} from "/imports/api/groups/groups";

dayjs.extend(utc);
dayjs.extend(timezone);

Meteor.publish("links", async function (groupId, date, timezone) {
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

    const start = dayjs.tz(date, timezone).startOf('day').toDate(); // local 00:00
    const end = dayjs.tz(date, timezone).endOf('day').toDate();     // local 23:59

    return Links.find({
            $and: [
                {groupId: groupId},
                {createdAt: {$gte: start, $lt: end}} // 날짜 필터 추가
            ]
        }
    );
});