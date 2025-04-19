// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpQE2KTpBEcOXsjAgmKv2gazb5D94qk3g",
  authDomain: "linkly-8c8d2.firebaseapp.com",
  projectId: "linkly-8c8d2",
  storageBucket: "linkly-8c8d2.firebasestorage.app",
  messagingSenderId: "375812492335",
  appId: "1:375812492335:web:98d893860c56230391cada",
  measurementId: "G-MT9PMSLZBP",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Firebase Messaging 초기화
const messaging = getMessaging(app);

// 푸시 알림 토큰을 받아오는 함수
export const requestForToken = () => {
  return getToken(messaging, {
    vapidKey:
      "BHo_U5vsR4x16mXKMjXTRpJyIikmeta8_8nQjhMI1xMBXhPX7P8x6UFeobCoikEQovBB3SWHNp2zRr8ntGcVi6w",
  });
};

// 푸시 알림 수신 (포그라운드 알림)
export const listenForMessages = (callback) => {
  onMessage(messaging, callback);
};

export default messaging;
