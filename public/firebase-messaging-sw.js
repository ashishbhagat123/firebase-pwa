importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCe0j2DOH4e0acLp2J_6UarPNa8-5BVIy4",
  authDomain: "next-pwa-cf417.firebaseapp.com",
  projectId: "next-pwa-cf417",
  storageBucket: "next-pwa-cf417.appspot.com",
  messagingSenderId: "740196772738",
  appId: "1:740196772738:web:95428d3a98c6e5c0f67d9b",
  measurementId: "G-WYL97Z0BE6",
});

const messaging = firebase.messaging();

// Handle background message
messaging.onBackgroundMessage((payload) => {
  console.log("Received background message ", payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "https://images.all-free-download.com/images/thumbjpg/apples_and_pears_192_517923.jpg",
    sound: "default",
    data: {  // Make sure the URL is passed in the data field
      url: payload.data.url || '/'
    }
  };

  // self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle push event
self.addEventListener('push', function(event) {
  const data = event.data.json();
   console.log(event)
  const notificationTitle = data.notification.title;
  const notificationOptions = {
    body: data.notification.body,
    icon: '/icons/icon-192x192.png',
    data: {  // Ensure URL is available here as well
      url: data.data.url || '/'
    }
  };

  event.waitUntil(
    // self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// Handle notification click event
self.addEventListener('notificationclick', function(event) {
  event.notification.close();  // Close the notification
  
  const targetUrl = event.notification.data.url;  // Get the URL from the notification data
  console.log(event)
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      // If there is at least one client window already open, focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window with the target URL
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
