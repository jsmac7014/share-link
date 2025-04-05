import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

Meteor.publish("links", function (groupId, date, timezone) {
    if (!this.userId) {
        // return error
        throw new Meteor.Error("not-authorized");
    }

    const start = dayjs.tz(date, timezone).startOf('day').toDate(); // local 00:00
    const end = dayjs.tz(date, timezone).endOf('day').toDate();     // local 23:59

    return Links.find({
            $and: [
                {groupId: groupId},
                {$or: [{owner: this.userId}, {members: {$in: [this.userId]}}]},
                {createdAt: {$gte: start, $lt: end}} // 날짜 필터 추가
            ]
        }
    );
});