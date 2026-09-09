"use client";

import React from "react";
import StoreProvider from "@/redux/StoreProvider";
import AuthProvider from "./AuthProvider";
import { SocketProvider } from "./SocketProvider";
import { Toaster } from "sonner";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <AuthProvider>
        <SocketProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </SocketProvider>
      </AuthProvider>
    </StoreProvider>
  );
}
