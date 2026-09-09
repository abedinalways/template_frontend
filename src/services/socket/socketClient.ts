import { io, Socket } from "socket.io-client";
import { ENV } from "@/constants/env";
import { ClientToServerEvents, ServerToClientEvents } from "@/types/socket";
import { tokenService } from "@/services/auth/tokenService";

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class SocketClientManager {
  private socket: TypedSocket | null = null;
  private isExplicitlyDisconnected = false;

  public getSocket(): TypedSocket | null {
    return this.socket;
  }

  public connect(customToken?: string): TypedSocket {
    this.isExplicitlyDisconnected = false;
    const token = customToken || tokenService.getAccessToken();

    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket) {
      // Update token in auth payload and reconnect
      if (token) {
        this.socket.auth = { token: `Bearer ${token}` };
      }
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(ENV.SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
      transports: ["websocket", "polling"],
      auth: (cb) => {
        const currentToken = tokenService.getAccessToken();
        cb({ token: currentToken ? `Bearer ${currentToken}` : "" });
      },
    });

    this.setupDefaultListeners();
    return this.socket;
  }

  public disconnect(): void {
    this.isExplicitlyDisconnected = true;
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupDefaultListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log(`[Socket] Connected successfully with ID: ${this.socket?.id}`);
    });

    this.socket.on("disconnect", (reason) => {
      console.warn(`[Socket] Disconnected: ${reason}`);
      if (!this.isExplicitlyDisconnected && reason === "io server disconnect") {
        // the server forcefully disconnected the socket, try manual reconnect
        this.socket?.connect();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error.message);
    });
  }
}

export const socketClient = new SocketClientManager();
