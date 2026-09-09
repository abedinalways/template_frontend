"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { socketClient, TypedSocket } from "@/services/socket/socketClient";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentToken, selectIsAuthenticated } from "@/redux/features/auth/authSelectors";

interface SocketContextValue {
  socket: TypedSocket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const token = useAppSelector(selectCurrentToken);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token || typeof token !== "string") {
      socketClient.disconnect();
      return;
    }

    const instance = socketClient.connect(token);

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    instance.on("connect", handleConnect);
    instance.on("disconnect", handleDisconnect);

    if (instance.connected) {
      handleConnect();
    }

    return () => {
      instance.off("connect", handleConnect);
      instance.off("disconnect", handleDisconnect);
      socketClient.disconnect();
    };
  }, [isAuthenticated, token]);

  const activeSocket =
    isAuthenticated && typeof token === "string" ? socketClient.getSocket() : null;

  return (
    <SocketContext.Provider value={{ socket: activeSocket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
