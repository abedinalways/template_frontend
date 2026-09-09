"use client";

import { useEffect, useRef } from "react";
import { useSocketContext } from "@/providers/SocketProvider";
import { ServerToClientEvents } from "@/types/socket";

type SocketListenerCarrier = {
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  off: (event: string, listener: (...args: unknown[]) => void) => void;
};

/**
 * Custom hook to safely subscribe to strongly-typed Socket.io events with auto cleanup on unmount.
 */
export function useSocketEvent<K extends keyof ServerToClientEvents>(
  eventName: K,
  handler: ServerToClientEvents[K]
) {
  const { socket, isConnected } = useSocketContext();
  const handlerRef = useRef(handler);

  // Keep latest reference without re-binding listener unnecessarily
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!socket) return;

    const carrier = socket as unknown as SocketListenerCarrier;
    const listener = (...args: unknown[]) => {
      const fn = handlerRef.current as unknown as (...args: unknown[]) => void;
      fn(...args);
    };

    carrier.on(eventName as string, listener);

    return () => {
      carrier.off(eventName as string, listener);
    };
  }, [socket, eventName]);

  return { socket, isConnected };
}
