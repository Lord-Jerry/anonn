// Scripts for firebase and firebase messaging
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyAAf2sf8YwjObeWy3ZzwOrB3eQwSJwpLi8',
  authDomain: 'anonn-web.firebaseapp.com',
  projectId: 'anonn-web',
  storageBucket: 'anonn-web.appspot.com',
  messagingSenderId: '526287699935',
  appId: '1:526287699935:web:097889c21922d44ddcce6a',
  measurementId: 'G-XG10325TM1',
};

// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);

  const notificationTitle = payload.data.sender;
  const notificationOptions = {
    body: payload.data.message,
    icon: '/images/favicon.png',
    data: payload.data,
    // actions:[
    //   {
    //     action: 'Reply',
    //     type: 'text',
    //     title: 'Reply',
    //     placeHolder: 'Reply to this message',
    //   }
    // ]
  };

  // eslint-disable-next-line no-restricted-globals
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

self.addEventListener('notificationclick', async (event) => {
  if (!event.action) {
    console.log(event)
    const payload = event.notification.data;
    const promiseChain = clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((windowClients) => {
        let matchingClient = null;
        const conversationId = payload.conversationId;
        const baseUrl = self.location.origin;
        const urlToOpen = new URL(`/conversations/${conversationId}`, baseUrl).href;

        for (const element of windowClients) {
          const windowClient = element;
          if (windowClient.url.startsWith(baseUrl)) {
            matchingClient = windowClient;
            break;
          }
        }

        if (matchingClient) {
          return matchingClient.openWindow(urlToOpen);
        }
        return clients.openWindow(urlToOpen);
      });

    event.waitUntil(promiseChain);
  }
});
