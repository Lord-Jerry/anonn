import Cookies from 'js-cookie';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getToken, getMessaging, Messaging } from 'firebase/messaging';
import ProfileService from './profile';
import { COOKIE_KEYS } from '../constants';

export class FirebaseService {
  private firebaseApp: FirebaseApp;
  private messaging: Messaging;

  private profileService = new ProfileService();

  constructor() {
    const app = initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    });
    this.firebaseApp = app;
    this.messaging = getMessaging(app);
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      return window.navigator.serviceWorker
        .getRegistration()
        .then((serviceWorker) => {
          console.log({ serviceWorker });
          return window.navigator.serviceWorker.register(
            '/firebase-messaging-sw.js'
          );
        });
    }
    throw new Error('The browser doesn`t support service worker.');
  }

  unregisterServiceWorker() {
    if ('serviceWorker' in navigator) {
      return window.navigator.serviceWorker
        .getRegistration()
        .then((serviceWorker) => {
          if (serviceWorker) {
            return serviceWorker.unregister();
          }
        });
    }
    throw new Error('The browser doesn`t support service worker.');
  }

  async promptForNotificationPermission() {
    if (!('Notification' in window))
      return alert('This browser does not support push notification');
    if (Notification.permission === 'granted') {
      return this.getToken();
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return this.getToken();
    }
  }

  async getToken() {
    let channelId = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    const token = await getToken(this.messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY,
    });

    channelId = await this.profileService.upsertUserDeviceToken(
      token,
      channelId
    );
    Cookies.set(COOKIE_KEYS.NOTIFICATION_DEVICE_ID, channelId);

    return token;
  }

  unsubscribeFromNotification() {
    this.unregisterServiceWorker();
    const channelId = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    if (channelId) {
      this.profileService.removeUserDeviceToken(channelId);
    }
    Cookies.remove(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    localStorage.removeItem(COOKIE_KEYS.SERVICE_WORKER_VERSION);
  }
}
