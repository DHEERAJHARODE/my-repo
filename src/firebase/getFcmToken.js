import { messaging } from "./firebaseConfig";
import { getToken } from "firebase/messaging";
import { saveFcmToken } from "./saveFcmToken";

export const getFcmToken = async (userId = "test-user-123") => {
  try {
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("❌ Notification permission denied");
      return;
    }

    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (token) {
      console.log("✅ FCM Token:", token);
      await saveFcmToken(userId, token);
    }
  } catch (error) {
    console.error("FCM error:", error);
  }
};
