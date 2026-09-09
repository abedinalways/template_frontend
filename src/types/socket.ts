export interface ServerToClientEvents {
  notification: (data: INotificationEvent) => void;
  onlineUsers: (userIds: string[]) => void;
  "user-status-changed": (data: { userId: string; status: "online" | "offline" }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
}

export interface INotificationEvent {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  createdAt: string;
}
