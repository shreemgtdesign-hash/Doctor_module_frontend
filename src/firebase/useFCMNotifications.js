import {
  useEffect,
} from "react";

import {
  listenForForegroundMessages,
} from "./notification";


const useFCMNotifications = () => {

  useEffect(() => {

    let unsubscribe =
      null;


    const setup =
      async () => {

        unsubscribe =
          await listenForForegroundMessages(
            (payload) => {

              console.log(
                "New notification:",
                payload
              );


              const title =
                payload.notification?.title ||
                payload.data?.title ||
                "New Appointment";


              const body =
                payload.notification?.body ||
                payload.data?.body ||
                "You have a new notification.";


              /*
               * Show native browser popup
               * while application is open.
               */

              if (
                Notification.permission ===
                "granted"
              ) {

                const notification =
                  new Notification(
                    title,
                    {
                      body,
                      icon:
                        "/logo192.png",
                    }
                  );


                notification.onclick =
                  () => {

                    const appointmentId =
                      payload.data
                        ?.appointment_id;


                    if (
                      appointmentId
                    ) {

                      window.location.href =
                        `/frontoffice/upcoming-appointments/${appointmentId}`;

                    } else {

                      window.location.href =
                        "/frontoffice/upcoming-appointments";

                    }

                  };

              }

            }
          );

      };


    setup();


    return () => {

      if (
        unsubscribe
      ) {

        unsubscribe();

      }

    };

  }, []);

};


export default useFCMNotifications;