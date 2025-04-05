import {Meteor} from "meteor/meteor";
import {Links} from "/imports/api/links/links";
import {check} from "meteor/check";
import cheerio from 'cheerio';
import { fetch } from 'meteor/fetch';
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
            const response = await fetch(link.link);
            if (!response.ok) {
                throw new Meteor.Error("link-not-found", "Link not found.");
            }
            const html = await response.text();
            const $ = cheerio.load(html);
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