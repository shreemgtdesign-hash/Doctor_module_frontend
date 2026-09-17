// ======================================================
// Firebase Messaging Service Worker
// public/firebase-messaging-sw.js
// ======================================================


// ======================================================
// FIREBASE SDK
// ======================================================

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
);


// ======================================================
// FIREBASE CONFIG
// ======================================================

firebase.initializeApp({
    apiKey: "AIzaSyAXZUNfcdWhKpUOsaMVIV4GLb3xJLzib8",
    authDomain: "sadop-ayurveda-hospital.firebaseapp.com",
    projectId: "sadop-ayurveda-hospital",
    storageBucket: "sadop-ayurveda-hospital.firebasestorage.app",
    messagingSenderId: "515672104681",
    appId: "1:515672104681:web:d5a50d56a4d2442b01da78",
    measurementId: "G-RDNRM72EH3",
});


// ======================================================
// FIREBASE MESSAGING
// ======================================================

const messaging = firebase.messaging();


// ======================================================
// BACKGROUND MESSAGE
// ======================================================

messaging.onBackgroundMessage((payload) => {

    console.log(
        "[firebase-messaging-sw.js] Background message received:",
        payload
    );


    // ----------------------------------------------
    // GET TITLE
    // ----------------------------------------------

    const notificationTitle =
        payload?.notification?.title ||
        payload?.data?.title ||
        "New Notification";


    // ----------------------------------------------
    // GET BODY
    // ----------------------------------------------

    const notificationBody =
        payload?.notification?.body ||
        payload?.data?.body ||
        "You have a new notification.";


    // ----------------------------------------------
    // GET APPOINTMENT ID
    // ----------------------------------------------

    const appointmentId =
        payload?.data?.appointment_id ||
        payload?.data?.appointmentId ||
        "";


    // ----------------------------------------------
    // NOTIFICATION OPTIONS
    // ----------------------------------------------

    const notificationOptions = {

        body: notificationBody,

        tag: appointmentId ? `apt_${appointmentId}` : undefined,

        renotify: true,

        data: {
            appointment_id: appointmentId,

            type:
                payload?.data?.type || "",

            url:
                payload?.data?.url || "",

            role:
                payload?.data?.role || "",
        },

    };


    // ----------------------------------------------
    // SHOW NOTIFICATION
    // ----------------------------------------------

    return self.registration.showNotification(
        notificationTitle,
        notificationOptions
    );

});


// ======================================================
// NOTIFICATION CLICK
// ======================================================

self.addEventListener(
    "notificationclick",
    (event) => {

        console.log(
            "[firebase-messaging-sw.js] Notification clicked"
        );


        event.notification.close();

        const notificationData =
            event.notification?.data || {};

        const appointmentId =
            notificationData.appointment_id;

        const role =
            (notificationData.role || "").toLowerCase();

        let targetUrl =
            notificationData.url || "";

        if (!targetUrl) {
            if (role === "doctor") {
                targetUrl = "/doctor/appointments";
            } else if (role === "duty_doctor" || role === "dutydoctor") {
                targetUrl = "/duty-doctor/dashboard";
            } else if (role === "pharmacist") {
                targetUrl = "/pharmacist/appointments";
            } else if (role === "therapist") {
                targetUrl = "/therapist/appointments";
            } else if (appointmentId) {
                targetUrl = `/frontoffice/upcoming-appointments/${appointmentId}`;
            } else {
                targetUrl = "/";
            }
        }


        // ------------------------------------------
        // FOCUS EXISTING TAB
        // ------------------------------------------

        event.waitUntil(

            clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true,
                })

                .then((clientList) => {

                    for (
                        const client
                        of clientList
                    ) {

                        let finalUrl = targetUrl;
                        if (!notificationData.url) {
                            if (client.url.includes("/doctor")) {
                                finalUrl = "/doctor/appointments";
                            } else if (client.url.includes("/duty-doctor")) {
                                finalUrl = "/duty-doctor/dashboard";
                            } else if (client.url.includes("/pharmacist")) {
                                finalUrl = "/pharmacist/appointments";
                            } else if (client.url.includes("/therapist")) {
                                finalUrl = "/therapist/appointments";
                            } else if (client.url.includes("/frontoffice") && appointmentId) {
                                finalUrl = `/frontoffice/upcoming-appointments/${appointmentId}`;
                            }
                        }

                        if (
                            "focus"
                            in client
                        ) {

                            client.navigate(
                                finalUrl
                            );

                            return client.focus();

                        }

                    }


                    // ----------------------------------
                    // OPEN NEW TAB
                    // ----------------------------------

                    if (
                        clients.openWindow
                    ) {

                        return clients.openWindow(
                            targetUrl
                        );

                    }


                    return undefined;

                })

        );

    }
);