import Cookies from 'js-cookie';
import { useEffect, useRef } from 'react';
import { FirebaseService } from 'services/firebase';

import { COOKIE_KEYS } from '../constants';

const serviceWorkerVersion = '0.0.2';

export const useRefreshNotificationToken = () => {
  const lockRef = useRef(false);

  useEffect(() => {
    const notificationEnabled = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    if (!notificationEnabled || lockRef.current) return;

    lockRef.current = true;

    const firebaseService = new FirebaseService();
    const deviceServiceWorkerVersion = localStorage.getItem(
      COOKIE_KEYS.SERVICE_WORKER_VERSION
    );

    if (deviceServiceWorkerVersion !== serviceWorkerVersion) {
      (async () => {
        await firebaseService.unregisterServiceWorker();
        await firebaseService.registerServiceWorker();
        localStorage.setItem(
          COOKIE_KEYS.SERVICE_WORKER_VERSION,
          serviceWorkerVersion
        );
        firebaseService.promptForNotificationPermission();
        console.log('Service worker updated');
      })();
    }
  }, []);
};

export const useForegroundNotification = () => {
  const lockRef = useRef(false);
  useEffect(() => {
    const notificationEnabled = Cookies.get(COOKIE_KEYS.NOTIFICATION_DEVICE_ID);
    if (!notificationEnabled || lockRef.current) return;

    const firebaseService = new FirebaseService();
    firebaseService.messageListener();
    
    lockRef.current = true;

  }, []);
}
