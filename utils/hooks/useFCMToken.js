


import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("Initial");

  const [loading, setLoading] = useState(false);
  const [askPermission, setAskPermission] = useState(false);

  // Register service worker once when the component mounts
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if ("serviceWorker" in navigator) {
          await navigator.serviceWorker.register("/firebase-messaging-sw.js");
          console.log("Service Worker registered successfully");
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if (Notification.permission === "granted" || Notification.permission === "denied") {
          console.log("Notification permission status:", Notification.permission);
          setNotificationPermissionStatus(Notification.permission);
          
          if (Notification.permission === "granted") {
            // Token generation
            const messaging = getMessaging(firebaseApp);
            const currentToken = await getToken(messaging, {
              vapidKey: "YOUR_VAPID_KEY", // Replace with your actual VAPID key
            });

            if (currentToken) {
              console.log("FCM token retrieved:", currentToken);
              setToken(currentToken);
            } else {
              console.log("No FCM registration token available.");
            }
          }
          setLoading(false);
          return; // Exit since permission is already determined
        }

        // Request permission if not already handled
        const permission = await Notification.requestPermission();
        console.log("Notification permission requested:", permission);
        setNotificationPermissionStatus(permission);
        
        if (permission === "granted") {
          // Token generation
          const messaging = getMessaging(firebaseApp);
          const currentToken = await getToken(messaging, {
            vapidKey:  "BEUXxu90-fjpE5w-lX49fvKKqcq6wGMF805YSeT1pLvWcuO-g_iNI7LSlJrrbFwT4dIuNJN2bgra2GyWwbl2U1g",
          });

          if (currentToken) {
            console.log("FCM token retrieved after permission request:", currentToken);
            setToken(currentToken);
          } else {
            console.log("No FCM registration token available after permission granted.");
          }
        } else {
          console.log("Notification permission was denied or dismissed.");
        }
      } catch (error) {
        console.error("Error retrieving FCM token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (askPermission) {
      console.log("Attempting to retrieve FCM token...");
      setLoading(true);
      retrieveToken();
    }
  }, [askPermission]);

  return { fcmToken: token, notificationPermissionStatus, loading, setAskPermission };
};

export default useFcmToken;














