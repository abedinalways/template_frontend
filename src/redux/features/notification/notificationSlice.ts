import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INotificationEvent } from "@/types";

interface NotificationState {
  notifications: INotificationEvent[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<INotificationEvent>) => {
      state.notifications.unshift(action.payload);
      // Cap at 50 to prevent unbounded memory growth in long-running sessions
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
      state.unreadCount += 1;
    },
    markAllAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAllAsRead, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
