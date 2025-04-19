import { Meteor } from "meteor/meteor";
import "/imports/startup/server";
import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin/app";
import serviceAccount from "./linkly-firebase-admin-service-account-key.json" with { type: "json" };

import "./web";

Meteor.startup(async () => {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
    });
  }

  Meteor.methods({
    sendPushNotification(userId: string, title: string, body: string) {
      const user = Meteor.users.findOne(userId);
      const token = user?.profile?.fcmToken;
      if (!token) throw new Meteor.Error("No FCM token");

      admin
        .messaging()
        .send({
          token,
          notification: { title, body },
        })
        .then((response) => {
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.error("Error sending message:", error);
        });
    },
    "save.fcm.token": async function (token: string) {
      const userId = Meteor.userId();
      const user = await Meteor.users.updateAsync(
        { _id: userId! },
        { $set: { "profile.fcmToken": token } },
      );

      return user;
    },
  });
});
