import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        setLoading(true);
        if ("serviceWorker" in navigator && "Notification" in window) {
          navigator.serviceWorker
            .register("/firebase-messaging-sw.js")
            .then(async (registration) => {
              console.log(
                "Registration successful, scope is:",
                registration.scope
              );

              try {
                const messaging = getMessaging(firebaseApp);
                const permission = await Notification.requestPermission();

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
                console.log(error);
                setLoading(false);
                alert(error);
              }
            })
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
        setLoading(false);
        alert(error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus, loading };
};

export default useFcmToken;
