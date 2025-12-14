import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const saveFcmToken = async (userId, token) => {
  if (!userId || !token) return;

  try {
    await setDoc(
      doc(db, "users", userId),
      {
        fcmToken: token,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("✅ FCM token saved to Firestore");
  } catch (error) {
    console.error("❌ Error saving FCM token:", error);
  }
};
