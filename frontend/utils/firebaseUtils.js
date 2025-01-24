import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBgRqjTZqbS142v0tQp3W7KgDKnh2I_Z7Q",
  authDomain: "document-approval-system.firebaseapp.com",
  projectId: "document-approval-system",
  storageBucket: "document-approval-system.firebasestorage.app",
  messagingSenderId: "303203465170",
  appId: "1:303203465170:web:499cd04e6d2592450fba0b",
  measurementId: "G-4LCGVGB5S8",
};

const vapidKey =
  "BJsIwRJOemwtHoiYI7fK1lc0JZCsVkw3QFkoWF0TngphfZ2pfqAbSCWUlR4BepFETGQizBn8q2_ubZKeKTyVtR4";

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  return Notification.requestPermission()
    .then(async (permission) => {
      if (permission === "granted") {
        return await getToken(messaging, {
          vapidKey,
        });
      } else {
        throw new Error("Notification permission denied");
      }
    })
    .catch((error) => {
      console.error("Error getting FCM token:", error);
      throw error;
    });
};

// export const onMessageListener = () => {
//   return new Promise((resolve) => {
//     onMessage(messaging, (payload) => {
//       resolve(payload);
//     });
//   });
// };

let onMessageCallback = null;

export const onMessageListener = (callback) => {
  if (typeof callback === "function") {
    onMessageCallback = callback;
  }

  onMessage(messaging, (payload) => {
    if (onMessageCallback) {
      onMessageCallback(payload);
    } else {
      console.warn("No callback registered for foreground messages.");
    }
  });
};
