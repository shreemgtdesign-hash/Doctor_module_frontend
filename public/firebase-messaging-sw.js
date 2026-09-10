/* ========================================
   FIREBASE MESSAGING SERVICE WORKER
======================================== */

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


// ========================================
// FIREBASE CONFIG
// ========================================

firebase.initializeApp({

  apiKey:
    "YOUR_ACTUAL_FIREBASE_API_KEY",

  authDomain:
    "YOUR_ACTUAL_FIREBASE_AUTH_DOMAIN",

  projectId:
    "YOUR_ACTUAL_FIREBASE_PROJECT_ID",

  storageBucket:
    "YOUR_ACTUAL_FIREBASE_STORAGE_BUCKET",

  messagingSenderId:
    "YOUR_ACTUAL_FIREBASE_MESSAGING_SENDER_ID",

  appId:
    "YOUR_ACTUAL_FIREBASE_APP_ID",

});


const messaging =
  firebase.messaging();


// ========================================
// BACKGROUND MESSAGE
// ========================================

messaging.onBackgroundMessage(
  (payload) => {

    console.log(
      "Background FCM message:",
      payload
    );


    const notificationTitle =
      payload.notification?.title ||
      payload.data?.title ||
      "New Notification";


    const notificationBody =
      payload.notification?.body ||
      payload.data?.body ||
      "You have a new notification.";


    const appointmentId =
      payload.data?.appointment_id ||
      "";


    const notificationOptions = {

      body:
        notificationBody,

      /*
       * Use an existing image from your public
       * folder if you have one.
       *
       * Otherwise remove icon and badge.
       */

      data: {

        appointment_id:
          appointmentId,

        type:
          payload.data?.type ||
          "",

      },

    };


    self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );

  }
);


// ========================================
// NOTIFICATION CLICK
// ========================================

self.addEventListener(
  "notificationclick",
  (event) => {

    event.notification.close();


    const appointmentId =
      event.notification
        ?.data
        ?.appointment_id;


    let targetUrl =
      "/frontoffice/upcoming-appointments";


    if (
      appointmentId
    ) {

      targetUrl =
        `/frontoffice/upcoming-appointments/${appointmentId}`;

    }


    event.waitUntil(

      clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      }).then(
        (clientList) => {

          for (
            const client
            of clientList
          ) {

            if (
              "focus" in client
            ) {

              client.navigate(
                targetUrl
              );

              return client.focus();

            }

          }


          if (
            clients.openWindow
          ) {

            return clients.openWindow(
              targetUrl
            );

          }

        }
      )

    );

  }
);