import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getToken,
  getMessaging,
  onMessage,
  Messaging,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let firebaseApp: FirebaseApp;
let messaging: Messaging;

export const initializeFirebase = () => {
  if (!firebaseApp) {
    firebaseApp = initializeApp(firebaseConfig);
  }
  if (!messaging && firebaseApp) {
    messaging = getMessaging(firebaseApp);
  }
};

export const getOrRegisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    return window.navigator.serviceWorker
      .getRegistration(window.location.href)
      .then((serviceWorker) => {
        console.log({ serviceWorker })
        return window.navigator.serviceWorker.register('/firebase-messaging-sw.js');
      });
  }
  throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
    getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })

export const requestToken = () => {
  if (!('Notification' in window)) {
    return alert('This browser does not support push notification');
  }

  if (Notification.permission === 'granted') {
    getFirebaseToken()
      .then((token) => {
        console.log('Firebase token', token);
        return token;
      })
      .catch((error) => {
        console.log('Error getting token', error);
      });
  } else {
    console.log('Notification permission', Notification.permission);
    Notification.requestPermission().then((permission) => {
        console.log({ permission })
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        getFirebaseToken()
          .then((token) => {
            console.log('Firebase token', token);
            return token;
          })
          .catch((error) => {
            console.log('Error getting token', error);
          });
      }
    });
  }
};

export const onForegroundMessage = () =>
  new Promise((resolve) => onMessage(messaging, (payload) => resolve(payload)));
