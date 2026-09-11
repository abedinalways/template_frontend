import { RootState } from "@/redux/store";

export const selectNotifications = (state: RootState) =>
  state.notification.notifications;

export const selectUnreadCount = (state: RootState) =>
  state.notification.unreadCount;
