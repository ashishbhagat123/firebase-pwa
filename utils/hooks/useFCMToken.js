import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("Initial");

  const [loading, setLoading] = useState(false);
  const [askPermission, setAskPermission] = useState(false)

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        if ("serviceWorker" in navigator && "Notification" in window) {
          setLoading(true);
          try {
            await navigator.serviceWorker.register("/firebase-messaging-sw.js");
            const permission = await Notification.requestPermission();
            const messaging = getMessaging(firebaseApp);
            setNotificationPermissionStatus(permission);
            if (permission === "granted") {
              const currentToken = await getToken(messaging, {
                vapidKey:
                  "BEUXxu90-fjpE5w-lX49fvKKqcq6wGMF805YSeT1pLvWcuO-g_iNI7LSlJrrbFwT4dIuNJN2bgra2GyWwbl2U1g",
              });
              setLoading(false);
              if (currentToken) {
                setToken(currentToken);
              } else {
                console.log(
                  "No registration token available. Request permission to generate one."
                );
              }
            } else if (permission === "denied") {
              setLoading(false);
            }
          } catch (error) {
            alert(error);
            setLoading(false);
          }
        }
      } catch (error) {
        alert(error);
        setLoading(false);
      }
    };


    if(askPermission){
      retrieveToken();
    }

  }, [askPermission]);

  return { fcmToken: token, notificationPermissionStatus, loading, setAskPermission };
};

export default useFcmToken;
