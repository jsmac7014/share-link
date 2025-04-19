import "/imports/startup/client";
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("SW 등록 성공:", registration);
    })
    .catch((err) => {
      console.error("SW 등록 실패:", err);
    });
}
