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
       navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length === 0) {
      navigator.serviceWorker.register('/firebase-messaging-sw.js');
    }
  });
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    registerServiceWorker();
  }, []);

  useEffect(() => {
    const retrieveToken = async () => {
      if (Notification.permission === "granted" || Notification.permission === "denied") {
        setNotificationPermissionStatus(Notification.permission);
        return; // Exit if permission has already been granted or denied
      }

      try {
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);
        
        if (permission === "granted") {
          const messaging = getMessaging(firebaseApp);
          const currentToken = await getToken(messaging, {
            vapidKey:   "BEUXxu90-fjpE5w-lX49fvKKqcq6wGMF805YSeT1pLvWcuO-g_iNI7LSlJrrbFwT4dIuNJN2bgra2GyWwbl2U1g",
          });
          if (currentToken) {
            setToken(currentToken);
          } else {
            console.log("No registration token available.");
          }
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      } finally {
        setLoading(false);
      }
    };

    if (askPermission) {
      setLoading(true);
      retrieveToken();
    }
  }, [askPermission]);

  return { fcmToken: token, notificationPermissionStatus, loading, setAskPermission };
};

export default useFcmToken;














