"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "./store";

interface StoreProviderProps {
  children: React.ReactNode;
}

export default function StoreProvider({ children }: StoreProviderProps) {
  // Lazily initialize store once per client tree render (React 19 pattern)
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
