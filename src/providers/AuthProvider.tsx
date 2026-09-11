"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentRefreshToken,
  selectCurrentToken,
  selectIsAuthInitialized,
} from "@/redux/features/auth/authSelectors";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { tokenService } from "@/services/auth/tokenService";
import {
  calculateNextRefreshDelay,
  executeSilentRefresh,
} from "@/services/auth/silentRefresh";

export default function AuthProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const token = useAppSelector(selectCurrentToken);
  const refreshToken = useAppSelector(selectCurrentRefreshToken);
  const isInitialized = useAppSelector(selectIsAuthInitialized);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Initial State Hydration from Cookies
  useEffect(() => {
    const savedToken = tokenService.getAccessToken();
    const savedRefreshToken = tokenService.getRefreshToken();
    const savedRole = tokenService.getUserRole();
    const savedUser = tokenService.getUserInfo();

    dispatch(
      setCredentials({
        token: savedToken || null,
        refreshToken: savedRefreshToken || null,
        role: savedRole || null,
        user: savedUser || null,
      })
    );
  }, [dispatch]);

  // 2. Proactive Silent Refresh Timer & Tab Visibility/Focus Listener
  useEffect(() => {
    if (!token) {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      return;
    }

    const scheduleRefresh = () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }

      const delayMs = calculateNextRefreshDelay(token);

      refreshTimerRef.current = setTimeout(async () => {
        const success = await executeSilentRefresh(dispatch, refreshToken);
        if (success) {
          scheduleRefresh();
        }
      }, delayMs);
    };

    scheduleRefresh();

    // Check token freshness when tab returns to focus or laptop wakes up
    const handleActivityCheck = async () => {
      if (document.visibilityState === "visible") {
        if (tokenService.isTokenExpired(token, 60)) {
          const success = await executeSilentRefresh(dispatch, refreshToken);
          // Reset the countdown timer so the next scheduled refresh is correct
          if (success) scheduleRefresh();
        }
      }
    };

    document.addEventListener("visibilitychange", handleActivityCheck);
    window.addEventListener("focus", handleActivityCheck);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
      document.removeEventListener("visibilitychange", handleActivityCheck);
      window.removeEventListener("focus", handleActivityCheck);
    };
  }, [dispatch, token, refreshToken]);

  // Prevent flicker during initial cookie evaluation
  if (!isInitialized) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground animate-pulse">Initializing application...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
