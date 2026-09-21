import {
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  fetchNotifications,
  readNotification,
  readAllNotifications,
} from "../../services/notificationService";

import { registerFCMToken } from "../../api/notificationApi";


// ======================================================
// LOAD NOTIFICATIONS
// ======================================================

export const loadNotifications =
  createAsyncThunk(
    "notifications/loadNotifications",

    async (_, { rejectWithValue }) => {
      try {
        return await fetchNotifications();
      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to load notifications."
        );
      }
    }
  );


// ======================================================
// MARK ONE NOTIFICATION AS READ
// ======================================================

export const markNotificationRead =
  createAsyncThunk(
    "notifications/markNotificationRead",

    async (
      notificationId,
      { rejectWithValue }
    ) => {
      try {
        const response =
          await readNotification(notificationId);

        return {
          notificationId,
          response,
        };

      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to mark notification as read."
        );
      }
    }
  );


// ======================================================
// MARK ALL AS READ
// ======================================================

export const markAllNotificationsRead =
  createAsyncThunk(
    "notifications/markAllNotificationsRead",

    async (_, { rejectWithValue }) => {
      try {
        return await readAllNotifications();

      } catch (error) {
        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to mark notifications as read."
        );
      }
    }
  );


// ======================================================
// REGISTER FCM TOKEN
// ======================================================

export const registerDeviceFCMToken =
  createAsyncThunk(
    "notifications/registerDeviceFCMToken",

    async (arg, { rejectWithValue }) => {

      try {

        // ----------------------------------------------
        // GET TOKEN
        // ----------------------------------------------

        const token =
          typeof arg === "string"
            ? arg
            : arg?.token;


        // ----------------------------------------------
        // GET ROLE
        // ----------------------------------------------

        const rawRole =
          typeof arg === "object" && arg?.role
            ? arg.role
            : localStorage.getItem("role");


        // ----------------------------------------------
        // NORMALIZE ROLE
        // ----------------------------------------------

        const role = (rawRole || "")
          .toString()
          .trim()
          .toLowerCase();


      

        const roleMap = {
          "juniordoctor": "junior_doctor",
          
          

          "doctor": "doctor",
          
          "frontoffice": "front_office",
         

          "pharmacist": "pharmacist",
          "admin": "admin",
        };


        const backendRole =
          roleMap[role] || role;


        // ----------------------------------------------
        // VALIDATE
        // ----------------------------------------------

        if (!token) {
          throw new Error("FCM token is missing.");
        }

        if (!backendRole) {
          throw new Error("User role is missing.");
        }


        // ----------------------------------------------
        // DEBUG
        // ----------------------------------------------

        console.log(
          "[FCM] Registering token:",
          {
            device_token: token,
            device_type: "web",
            original_role: rawRole,
            backend_role: backendRole,
          }
        );


        // ----------------------------------------------
        // REGISTER TOKEN
        // ----------------------------------------------

        const response =
          await registerFCMToken({
            device_token: token,
            role: backendRole,
            device_type: "web",
          });


        return response.data;

      } catch (error) {

        console.error(
          "[FCM] Token registration failed:",
          error.response?.data || error.message
        );

        return rejectWithValue(
          error.response?.data ||
          error.message ||
          "Failed to register FCM token."
        );
      }
    }
  );


// ======================================================
// FRONT OFFICE FCM TOKEN
// ======================================================

export const registerFrontOfficeFCMToken =
  registerDeviceFCMToken;