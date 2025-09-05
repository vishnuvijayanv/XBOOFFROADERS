// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB4ZyTzqPq5h1UIirHbpktyPh2LjgktpXo",
  authDomain: "xbooffroaders.firebaseapp.com",
  projectId: "xbooffroaders",
  storageBucket: "xbooffroaders.firebasestorage.app",
  messagingSenderId: "1037010849119",
  appId: "1:1037010849119:web:ebfc53fb2e9a867028faea",
  measurementId: "G-XZMG9Z5C0T",
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Get FCM token
export const getFCMToken = async (setTokenFound) => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BAwKsq61qt3xbfkYkSTJ5Vy8fzTyL6zPko4SUfQfVg98YOstie8D1EghlB0wTkGVNk9YqFoecjAFWoY3RS1hM0k", // from Firebase console
    });
    if (currentToken) {
      console.log("FCM Token:", currentToken);
      setTokenFound(true);
      return currentToken;
    } else {
      console.log("No registration token available.");
      setTokenFound(false);
      return null;
    }
  } catch (err) {
    console.error("Error getting FCM token:", err);
    setTokenFound(false);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = (callback) => {
  onMessage(messaging, (payload) => {
    console.log("Message received:", payload);
    callback(payload);
  });
};

export default app;
