importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  // Your Firebase config here
  apiKey: "AIzaSyCe0j2DOH4e0acLp2J_6UarPNa8-5BVIy4",
  authDomain: "next-pwa-cf417.firebaseapp.com",
  projectId: "next-pwa-cf417",
  storageBucket: "next-pwa-cf417.appspot.com",
  messagingSenderId: "740196772738",
  appId: "1:740196772738:web:95428d3a98c6e5c0f67d9b",
  measurementId: "G-WYL97Z0BE6",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://images.all-free-download.com/images/thumbjpg/apples_and_pears_192_517923.jpg",
    "sound": "default"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('push', function(event) {
  const data = event.data.json();
  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: '/icons/icon-192x192.png'
  };

  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();  // Close the notification
  const targetUrl = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // If there is at least one client window already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
