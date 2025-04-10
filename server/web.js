import { isbot } from "isbot";
import { WebApp } from "meteor/webapp";
import { Meteor } from "meteor/meteor";
import { Groups } from "/imports/api/groups/groups";
import { Invites } from "/imports/api/invites/invites";

WebApp.connectHandlers.use("/group/:groupId", async (req, res, next) => {
  if (isbot(req.headers["user-agent"])) {
    const groupId = req.params.groupId;
    const group = await Groups.findOneAsync(groupId);
    console.log(group);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html>
            <head>
                <title>Group</title>
                <meta property="og:image" content="/default-og.png">
                <meta property="og:image:width" content="1200">
                <meta property="og:image:height" content="630">
                <meta property="og:title" content="${group.name}" />
                <meta property="og:description" content="${group.description}" />
            </head>
            </html>`);
  } else {
    next();
  }
});

WebApp.connectHandlers.use("/invite/:inviteId", async (req, res, next) => {
  if (isbot(req.headers["user-agent"])) {
    const groupId = req.params.inviteId;
    const invite = await Invites.findOneAsync(groupId);
    const group = await Groups.findOneAsync(invite.groupId);
    const user = await Meteor.users.findOneAsync(invite.user);
    console.log(user);

    const description = `${user.profile.name} has invited you to ${group.name} on Linkly!`;

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`<html>
            <head>
                <title>Group</title>
                <meta property="og:image" content="/default-og.png">
                <meta property="og:image:width" content="1200">
                <meta property="og:image:height" content="630">
                <meta property="og:title" content="${description}" />
                <meta property="og:description" content="${description}" />
            </head>
            </html>`);
  } else {
    next();
  }
});
