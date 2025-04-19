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
    "save.fcm.token": async function (token: string) {
      const userId = Meteor.userId();
      const user = await Meteor.users.updateAsync(
        { _id: userId! },
        { $addToSet: { "profile.fcmToken": token } },
      );
      return user;
    },
  });
});
