import {
  createSlice,
} from "@reduxjs/toolkit";
import { loadNotifications, markAllNotificationsRead, markNotificationRead } from "./notificationThiunk";




const initialState = {

  notifications: [],

  unreadCount: 0,

  total: 0,

  loading: false,

  error: null,

};


const notificationSlice =
  createSlice({

    name: "notifications",

    initialState,

    reducers: {

      clearNotificationError: (
        state
      ) => {

        state.error = null;

      },

    },


    extraReducers: (builder) => {

      // ==============================================
      // LOAD NOTIFICATIONS
      // ==============================================

      builder

        .addCase(
          loadNotifications.pending,
          (state) => {

            state.loading = true;
            state.error = null;

          }
        )

        .addCase(
          loadNotifications.fulfilled,
          (state, action) => {

            state.loading = false;

            const payload =
              action.payload || {};

            state.notifications =
              payload.data || [];

            state.unreadCount =
              payload.unread_count || 0;

            state.total =
              payload.total || 0;

          }
        )

        .addCase(
          loadNotifications.rejected,
          (state, action) => {

            state.loading = false;

            state.error =
              action.payload ||
              "Failed to load notifications.";

          }
        );


      // ==============================================
      // MARK SINGLE NOTIFICATION READ
      // ==============================================

      builder.addCase(
        markNotificationRead.fulfilled,
        (state, action) => {

          const notificationId =
            action.payload
              ?.notificationId;


          const notification =
            state.notifications.find(
              (item) =>
                item.id === notificationId
            );


          if (
            notification &&
            !notification.is_read
          ) {

            notification.is_read = true;

            state.unreadCount =
              Math.max(
                0,
                state.unreadCount - 1
              );

          }

        }
      );


      // ==============================================
      // MARK ALL READ
      // ==============================================

      builder.addCase(
        markAllNotificationsRead.fulfilled,
        (state) => {

          state.notifications =
            state.notifications.map(
              (notification) => ({
                ...notification,
                is_read: true,
              })
            );

          state.unreadCount = 0;

        }
      );

    },

  });


export const {
  clearNotificationError,
} = notificationSlice.actions;


export default notificationSlice.reducer;