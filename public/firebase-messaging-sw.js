// // Import the functions you need from the SDKs you need
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.6.0/firebase-messaging-compat.js");
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
//
// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpQE2KTpBEcOXsjAgmKv2gazb5D94qk3g",
  authDomain: "linkly-8c8d2.firebaseapp.com",
  projectId: "linkly-8c8d2",
  messagingSenderId: "375812492335",
  appId: "1:375812492335:web:98d893860c56230391cada",
};

// // Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("[sw.js] 백그라운드 메시지 ", payload);
});
