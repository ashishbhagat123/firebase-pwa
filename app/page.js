"use client";

import Image from "next/image";
import styles from "./page.module.css";
import firebaseApp from "@/utils/firebase/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import useFcmToken from "@/utils/hooks/useFCMToken";
import { useServiceWorker } from "@/utils/hooks/useServiceWorker";

export default function Home() {
  const {
    fcmToken,
    notificationPermissionStatus,
    loading,
    support,
    setAskPermission,
  } = useFcmToken();
  // Use the token as needed
  console.log("FCM token:", fcmToken);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if ("serviceWorker" in navigator && "Notification" in window) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
  }, []);

  return (
    <div className={styles.page}>
      <p>Notification Permission</p>
      <p>{notificationPermissionStatus}</p>
      {loading ? (
        <p>Fetching Token</p>
      ) : (
        <p className={styles.token}>{fcmToken}</p>
      )}
      {support ? "support success" : "support failed"}
      <button onClick={() => setAskPermission((prev) => !prev)}>
        SetPermission
      </button>
    </div>
  );
}
