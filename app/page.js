"use client";

import Image from "next/image";
import styles from "./page.module.css";
import firebaseApp from "@/utils/firebase/firebase";
import { getMessaging, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import useFcmToken from "@/utils/hooks/useFCMToken";
import { useServiceWorker } from "@/utils/hooks/useServiceWorker";

export default function Home() {
  const { fcmToken, notificationPermissionStatus, loading, setAskPermission } =
    useFcmToken();
  // Use the token as needed
  console.log("FCM token:", fcmToken);
  const [supported, setSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if ("serviceWorker" in navigator && "Notification" in window) {
      setSupported(true);
      const messaging = getMessaging(firebaseApp);
      const unsubscribe = onMessage(messaging, (payload) => {});

      const handler = (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Save the event so it can be triggered later
        setDeferredPrompt(e);
        // Make the button visible
        setIsVisible(true);
      };

      window.addEventListener("beforeinstallprompt", handler);

      return () => {
        unsubscribe(); // Unsubscribe from the onMessage event
        window.removeEventListener("beforeinstallprompt", handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        console.log("User accepted the install prompt");
      } else {
        console.log("User dismissed the install prompt");
      }
      // Clear the saved prompt
      setDeferredPrompt(null);
      // Hide the button
      setIsVisible(false);
    }
  };

  return (
    <div className={styles.page}>
      <p>
        Notification Permission: {notificationPermissionStatus?.toUpperCase()}{" "}
      </p>
      {loading ? (
        <p>Fetching Token</p>
      ) : (
        <p className={styles.token}>{fcmToken}</p>
      )}
      {supported ? "Support success" : "Support failed"}
      <button
        className={styles.btn}
        onClick={() => setAskPermission((prev) => !prev)}
      >
        Enable Notification
      </button>
      {isVisible && (
        <button
          onClick={handleInstallClick}
          className= {styles.pwaCta}
        >
          Install PWA
        </button>
      )}

    </div>
  );
}
