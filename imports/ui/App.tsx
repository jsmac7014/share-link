import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "/imports/startup/client/routes";
import { HelmetProvider } from "react-helmet-async";

export const App = () => {
  async function handleAllowNotification() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      console.log("알림 권한이 허용되었습니다.");
    } else if (permission === "denied") {
      console.log("알림 권한이 거부되었습니다.");
    } else {
      console.log("사용자가 알림 권한을 결정하지 않았습니다.");
    }
  }

  useEffect(() => {
    handleAllowNotification();
  }, []);

  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};
