import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";
import {check} from "meteor/check";
import cheerio from 'cheerio';
import type { Link } from "/imports/types/types";

Meteor.methods({
    "insert.link": async function (link: Object) {
        check(link, {
            link: String,
            groupId: String
        });

        // Check if the user is logged in
        if (!this.userId) {
            throw new Meteor.Error("not-authorized", "You must be logged in to add a link.");
        }

        // fetch meta data from the link
        try {
            const response = await fetch(link.link, {
                method: 'GET',
                headers: {
                    // 'Cache-Control': 'max-age=0',
                //     user agent as bot
                    'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/58.0.3029.110 Safari/537.3',
                }
            })
            const statusCode = response.status;
            const html = await response.text();

            if(statusCode !== 200) {
                throw new Meteor.Error("link-fetch-error", "This link cannot be fetched.");
            }

            const $ = cheerio.load(html);
            console.log($("title").text());
            console.log($('meta[name="description"]').attr('content'));
            console.log($('meta[property="og:image"]').attr('content'));

            const obj: Link = {
                url: link.link,
                title: $("title").text(),
                description: $('meta[name="description"]').attr('content'),
                imageLink: $('meta[property="og:image"]').attr('content'),
                groupId: link.groupId,
                owner: this.userId,
                createdAt: new Date(),
            }
            return Links.insertAsync(obj);
        } catch (error) {
            throw new Meteor.Error("link-fetch-error", "Error fetching link data.");
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
    }
})