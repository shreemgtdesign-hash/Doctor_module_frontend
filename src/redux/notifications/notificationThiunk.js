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
          await readNotification(
            notificationId
          );

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

export const registerDeviceFCMToken = createAsyncThunk(
  "notifications/registerDeviceFCMToken",

  async (arg, { rejectWithValue }) => {
    try {
      const token = typeof arg === "string" ? arg : arg?.token;
      const rawRole = typeof arg === "object" ? arg?.role : localStorage.getItem("role");
      const cleanRole = (rawRole || "").toString().toLowerCase().trim().replace(/[\s-]/g, "_");

      const response = await registerFCMToken({
        device_token: token,
        role: cleanRole,
        device_type: "web",
      });

      return response.data;

    } catch (error) {
      return rejectWithValue(
        error.response?.data ||
        error.message ||
        "Failed to register FCM token."
      );
    }
  }
);

export const registerFrontOfficeFCMToken = registerDeviceFCMToken;