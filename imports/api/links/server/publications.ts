import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";

Meteor.publish("links", function (groupId, date) {
    if (!this.userId) {
        // return error
        throw new Meteor.Error("not-authorized");
    }

    const reqDate = new Date(date);
    reqDate.setHours(0, 0, 0, 0);

    const nextDate = new Date(reqDate);
    nextDate.setDate(reqDate.getDate() + 1); //

    return Links.find({
            $and: [
                {groupId: groupId},
                {$or: [{owner: this.userId}, {members: {$in: [this.userId]}}]},
                {createdAt: {$gte: reqDate, $lt: nextDate}} // 날짜 필터 추가
            ]
        }
    );
});