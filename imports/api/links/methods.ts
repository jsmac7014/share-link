import { Meteor } from "meteor/meteor";
import { Links } from "/imports/api/links/links";
import { check } from "meteor/check";
import cheerio from "cheerio";
import type { Link } from "/imports/types/types";
import admin from "firebase-admin";

async function fetchMeta(link: string) {
  // fetch meta data from the link
  try {
    // if link is amazon.com
    // use Googlebot user agent header
    // else use default user agent header

    const isAmazon = link.includes("amazon.com");
    const isYoutube = link.includes("youtube.com");

    const userAgent =
      isAmazon || isYoutube
        ? "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/58.0.3029.110 Safari/537.3"
        : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3";
    const response = await fetch(link, {
      method: "GET",
      headers: {
        "Cache-Control": "max-age=0",
        "User-Agent": userAgent,
      },
    });
    const statusCode = response.status;
    const html = await response.text();

    if (statusCode !== 200) {
      throw new Meteor.Error("link-fetch-error", "This link cannot be fetched.");
    }

    const $ = cheerio.load(html);
    console.log($("title").text());
    console.log($('meta[name="description"]').attr("content"));
    console.log($('meta[property="og:image"]').attr("content"));

    const obj = {
      title: $("title").text(),
      description: $('meta[name="description"]').attr("content"),
      imageLink: $('meta[property="og:image"]').attr("content"),
    };

    return obj;
  } catch (error) {
    throw new Meteor.Error("link-fetch-error", "Error fetching link data.");
  }
}

Meteor.methods({
  "insert.link": async function (url: string, preview: Partial<Link>, groupId: string) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to add a link.");
    }
    // Check if user has access to this group
    const group = await Meteor.callAsync("groups.get", groupId);
    console.log(group);
    if (group[0].ownerInfo._id !== this.userId && !group[0].members.includes(this.userId)) {
      throw new Meteor.Error(
        "not-authorized",
        "You are not authorized to add a link to this group.",
      );
    }

    // insert link
    const newLink: Link = {
      url: url,
      title: preview.title!,
      description: preview.description,
      imageLink: preview.imageLink,
      groupId: groupId,
      owner: this.userId,
      createdAt: new Date(),
    };
    await Links.insertAsync(newLink);

    // get users fcmToken in the group
    const users = await Meteor.users
      .find(
        {
          _id: {
            $in: group[0].members,
          },
        },
        { fields: { "profile.fcmToken": 1 } },
      )
      .fetch();
    console.log(users);
    const tokens = users
      .map((user) => user.profile?.fcmToken || []) // fcmToken이 배열이라고 가정
      .flat(); // 2차원 배열을 평탄화

    console.log(tokens);
    if (tokens.length !== 0) {
      try {
        const messagePayload = {
          notification: {
            title: preview.title,
            body: preview.description,
          },
          tokens: tokens,
        };
        const response = await admin.messaging().sendEachForMulticast(messagePayload);

        console.log("푸시 알림 전송 성공:", response);
        return response;
      } catch (error) {
        console.error("푸시 알림 전송 실패:", error);
      }
    }
  },

  "delete.link": async function (linkId: string) {
    check(linkId, String);
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to delete a link.");
    }

    // Check if the link exists and belongs to the user
    const link = await Links.findOneAsync(linkId);
    if (!link) {
      throw new Meteor.Error("link-not-found", "Link not found.");
    }
    if (link.owner !== this.userId) {
      throw new Meteor.Error("not-authorized", "You are not authorized to delete this link.");
    }

    return Links.removeAsync(linkId);
  },

  "preview.link": async function (link: string) {
    check(link, String);
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to preview a link.");
    }
    // fetch meta data from the link
    const result = await fetchMeta(link);
    if (!result) {
      throw new Meteor.Error("link-fetch-error", "Error fetching link data.");
    }

    return result;
  },
});
