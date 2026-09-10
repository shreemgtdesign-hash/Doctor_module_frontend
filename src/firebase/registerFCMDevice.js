import { saveFCMToken } from "../services/notificationService";
import {
  getFCMToken,
} from "./notification";



export const registerFCMDevice =
  async (role) => {

    try {

      const token =
        await getFCMToken();


      if (!token) {

        console.warn(
          "FCM token was not generated."
        );

        return null;

      }


      const payload = {

        device_token:
          token,

        device_type:
          "web",

        role:
          role,

      };


      console.log(
        "Registering FCM device:",
        payload
      );


      const response =
        await saveFCMToken(
          payload
        );


      console.log(
        "FCM device registered:",
        response
      );


      return response;

    } catch (error) {

      console.error(
        "Failed to register FCM device:",
        error
      );

      return null;

    }

  };