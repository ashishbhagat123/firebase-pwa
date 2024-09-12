import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import firebaseApp from "../firebase/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState("");

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        setLoading(true)
        if ("serviceWorker" in navigator) {
          const messaging = getMessaging(firebaseApp);

          // Retrieve the notification permission status
          try {
          } catch (error) {
            console.log(error);
          }
          const permission = await Notification.requestPermission();

          setNotificationPermissionStatus(permission);
          setLoading(false)
          // Check if permission is granted before retrieving the token
          if (permission === "granted") {
            const currentToken = await getToken(messaging, {
              vapidKey:
                "BEUXxu90-fjpE5w-lX49fvKKqcq6wGMF805YSeT1pLvWcuO-g_iNI7LSlJrrbFwT4dIuNJN2bgra2GyWwbl2U1g",
            });
          
            if (currentToken) {
              setToken(currentToken);
            } else {
              console.log(
                "No registration token available. Request permission to generate one."
              );
            }
          } else if (permission === "denied") {
            alert("Grant notification permission");
            setLoading(false)
          }
        }
      } catch (error) {
        console.log("An error occurred while retrieving token:", error);
        setLoading(false)
        alert(error);
      }
    };

    retrieveToken();
  }, []);

  return { fcmToken: token, notificationPermissionStatus, loading };
};

export default useFcmToken;
