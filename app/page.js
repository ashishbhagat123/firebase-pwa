"use client";

import Image from "next/image";
import styles from "./page.module.css";
import firebaseApp from "@/utils/firebase/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import useFcmToken from "@/utils/hooks/useFCMToken";
import { useServiceWorker } from "@/utils/hooks/useServiceWorker";

export default function Home() {
  const { fcmToken, notificationPermissionStatus } = useFcmToken();
  // Use the token as needed
  fcmToken && console.log("FCM token:", fcmToken);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {
        console.log("Foreground push notification received:", payload);

        // Handle the received push notification while the app is in the foreground
        // You can display a notification or update the UI based on the payload
      });
      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
      };
    }
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(function(registration) {
          console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function(err) {
          console.log("Service worker registration failed, error:", err);
        });
    }
  }, []);

  return (

    <div className={styles.page}>
      Token:
      <p style={styles.token}>{fcmToken}</p>
    </div>

  );
}
