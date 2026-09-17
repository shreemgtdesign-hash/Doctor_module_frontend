// ======================================================
// Firebase
// src/firebase/firebase.js
// ======================================================

import {
    initializeApp,
} from "firebase/app";

import {
    getMessaging,
    getToken,
} from "firebase/messaging";


// ======================================================
// FIREBASE CONFIG
// ======================================================

const firebaseConfig = {

    apiKey:
        "AIzaSyAXZUNfcdWhkHpuOsaMVIV4GLb3xJLzib8",

    authDomain:
        "sadop-ayurveda-hospital.firebaseapp.com",

    projectId:
        "sadop-ayurveda-hospital",

    storageBucket:
        "sadop-ayurveda-hospital.firebasestorage.app",

    messagingSenderId:
        "515672104681",

    appId:
        "1:515672104681:web:d5a50d56a4d2442b01da78",

    measurementId:
        "G-RDNRM72EH3",

};


// ======================================================
// INITIALIZE FIREBASE
// ======================================================

const app =
    initializeApp(
        firebaseConfig
    );


// ======================================================
// FIREBASE MESSAGING
// ======================================================

export const messaging =
    getMessaging(app);


// ======================================================
// VAPID PUBLIC KEY
// ======================================================

const VAPID_KEY =
    "BHFv7SYAA7IynjIb-63nxcSyl4-8xTP8PybV3t8_ylg6_WEHdi1jtc72PjrlEHjPEb1FG_2sQPeTQTxucDlpUmQ";


// ======================================================
// GENERATE FCM TOKEN
// ======================================================

export const generateToken =
    async () => {

        try {

            // ------------------------------------------
            // BROWSER SUPPORT CHECK
            // ------------------------------------------

            if (
                typeof window === "undefined" ||
                !("Notification" in window) ||
                !("serviceWorker" in navigator)
            ) {
                console.warn(
                    "Push notifications are not supported in this environment."
                );
                return null;
            }

            // ------------------------------------------
            // REQUEST PERMISSION
            // ------------------------------------------

            const permission =
                await Notification.requestPermission();


            console.log(
                "Notification permission:",
                permission
            );


            if (
                permission !==
                "granted"
            ) {

                console.warn(
                    "Notification permission was not granted."
                );

                return null;

            }


            // ------------------------------------------
            // SERVICE WORKER
            // ------------------------------------------

            const serviceWorkerRegistration =
                await navigator.serviceWorker.register(
                    "/firebase-messaging-sw.js"
                );


            console.log(
                "Firebase service worker registered:",
                serviceWorkerRegistration
            );


            // ------------------------------------------
            // GET FCM TOKEN
            // ------------------------------------------

            const token =
                await getToken(
                    messaging,
                    {
                        vapidKey:
                            VAPID_KEY,

                        serviceWorkerRegistration:
                            serviceWorkerRegistration,
                    }
                );


            console.log(
                "FCM Token:",
                token
            );


            return token;

        } catch (error) {

            console.error(
                "Failed to generate FCM token:",
                error
            );

            return null;

        }

    };