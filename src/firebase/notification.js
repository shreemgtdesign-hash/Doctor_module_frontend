import {
  getToken,
  onMessage,
} from "firebase/messaging";

import {
  getFirebaseMessaging,
} from "./firebase";


// ========================================
// GET FCM TOKEN
// ========================================
const vapidKey =
  import.meta.env.VITE_FIREBASE_VAPID_KEY;

console.log(
  "VAPID KEY:",
  vapidKey
);

console.log(
  "VAPID KEY LENGTH:",
  vapidKey?.length
);

export const getFCMToken =
  async () => {

    try {

      if (
        !("Notification" in window)
      ) {

        console.warn(
          "Browser does not support notifications."
        );

        return null;

      }


      const permission =
        await Notification.requestPermission();


      if (
        permission !== "granted"
      ) {

        console.warn(
          "Notification permission was not granted."
        );

        return null;

      }


      const messaging =
        await getFirebaseMessaging();


      if (!messaging) {

        console.warn(
          "Firebase Messaging is not supported."
        );

        return null;

      }


      /*
       * Register the Firebase service worker.
       */

      const registration =
        await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js"
        );


      const token =
        await getToken(
          messaging,
          {
            vapidKey:
              import.meta.env
                .VITE_FIREBASE_VAPID_KEY,

            serviceWorkerRegistration:
              registration,
          }
        );


      if (!token) {

        console.warn(
          "No FCM token generated."
        );

        return null;

      }


      console.log(
        "FCM TOKEN:",
        token
      );


      return token;

    } catch (error) {

      console.error(
        "FCM token error:",
        error
      );

      return null;

    }

  };


// ========================================
// FOREGROUND MESSAGE LISTENER
// ========================================

export const listenForForegroundMessages =
  async (
    onNotification
  ) => {

    try {

      const messaging =
        await getFirebaseMessaging();


      if (!messaging) {
        return () => {};
      }


      const unsubscribe =
        onMessage(
          messaging,
          (payload) => {

            console.log(
              "FCM foreground message:",
              payload
            );


            if (
              onNotification
            ) {

              onNotification(
                payload
              );

            }

          }
        );


      return unsubscribe;

    } catch (error) {

      console.error(
        "FCM foreground listener error:",
        error
      );

      return () => {};

    }

  };