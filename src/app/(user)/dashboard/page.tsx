"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentRole,
  selectCurrentToken,
  selectCurrentUser,
} from "@/redux/features/auth/authSelectors";
import {
  addNotification,
  markAllAsRead,
} from "@/redux/features/notification/notificationSlice";
import { useSocketContext } from "@/providers/SocketProvider";
import { tokenService } from "@/services/auth/tokenService";
import { executeSilentRefresh } from "@/services/auth/silentRefresh";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  User,
  Radio,
  RefreshCw,
  Bell,
  Clock,
  Zap,
  CheckCircle2,
} from "lucide-react";

export default function UserDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentRole);
  const token = useAppSelector(selectCurrentToken);
  const notifications = useAppSelector((state) => state.notification.notifications);
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  const { isConnected } = useSocketContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tokenExpSeconds, setTokenExpSeconds] = useState<number | null>(null);

  // Live timer calculating seconds until access token expiry
  useEffect(() => {
    if (!token || typeof token !== "string") return;

    const checkExp = () => {
      const expMs = tokenService.getTokenExpiryMs(token);
      if (expMs) {
        const remaining = Math.max(0, Math.floor((expMs - Date.now()) / 1000));
        setTokenExpSeconds(remaining);
      }
    };

    checkExp();
    const interval = setInterval(checkExp, 1000);
    return () => clearInterval(interval);
  }, [token]);

  // Handle manual silent refresh trigger
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    toast.info("Triggering Mutex-guarded token refresh...");

    const success = await executeSilentRefresh(dispatch);
    setIsRefreshing(false);

    if (success) {
      toast.success("Token refreshed successfully without interrupting user state!");
    } else {
      toast.error("Token refresh failed. Check backend credentials.");
    }
  };

  // Simulate a real-time incoming socket notification
  const handleSimulateSocketEvent = () => {
    const mockNotification = {
      id: "notif_" + Date.now(),
      title: "Realtime Socket Event",
      message: `New event received at ${new Date().toLocaleTimeString()} via Socket.io client!`,
      type: "info" as const,
      createdAt: new Date().toISOString(),
    };

    dispatch(addNotification(mockNotification));
    toast.info(mockNotification.title, {
      description: mockNotification.message,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              User Dashboard
            </h1>
            <Badge variant="success">Protected Area</Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Realtime state inspection for Redux, Silent Token Refresh, and Socket.io
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            isLoading={isRefreshing}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4 text-blue-400" />
            <span>Test Token Refresh</span>
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSimulateSocketEvent}
            className="gap-2"
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Simulate Socket Event</span>
          </Button>
        </div>
      </div>

      {/* Grid of Diagnostic & Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Auth & User Profile State */}
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-blue-400" />
                Auth & Session
              </CardTitle>
              <Badge variant={role === "admin" ? "warning" : "default"}>
                {role || "user"}
              </Badge>
            </div>
            <CardDescription>Pure Redux `authSlice` state</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">User ID:</span>
              <span className="font-mono text-neutral-200">{user?._id || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Name:</span>
              <span className="font-medium text-neutral-200">{user?.name || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Email:</span>
              <span className="text-neutral-200">{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-neutral-400">Status:</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" /> Authenticated
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Proactive Silent Refresh Diagnostics */}
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                Token Lifetime
              </CardTitle>
              <Badge variant="outline">Buffer: 60s</Badge>
            </div>
            <CardDescription>Managed by `tokenService` & `AuthProvider`</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Expires in:</span>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {tokenExpSeconds !== null ? `${tokenExpSeconds}s` : "Unknown"}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Race-Condition Lock:</span>
              <span className="text-blue-400 font-medium">Mutex Protected</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Visibility Listener:</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
              Token is auto-refreshed before expiration or whenever laptop wakes from sleep.
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Socket.io Client Diagnostics */}
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Radio className="h-4 w-4 text-purple-400" />
                Socket.io Client
              </CardTitle>
              <Badge variant={isConnected ? "success" : "secondary"}>
                {isConnected ? "Connected" : "Idle / Mock"}
              </Badge>
            </div>
            <CardDescription>Singleton client & React provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Token Attached:</span>
              <span className="text-emerald-400 font-medium">Yes (Bearer)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Reconnection:</span>
              <span className="text-neutral-200">Auto (10 attempts)</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-neutral-800">
              <span className="text-neutral-400">Unread Events:</span>
              <span className="text-purple-400 font-bold">{unreadCount}</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed pt-1">
              Auto-connects on login, cleanly disconnects on logout with zero memory leaks.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Realtime Event Stream */}
      <Card className="border-neutral-800 bg-neutral-900/40">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4 text-amber-400" />
              Realtime Event Stream & Notifications
            </CardTitle>
            <CardDescription>
              Shows incoming Socket.io payloads stored in Redux `notificationSlice`
            </CardDescription>
          </div>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch(markAllAsRead())}
              className="text-xs"
            >
              Clear Read
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-neutral-500 text-sm">
              No notifications yet. Click &quot;Simulate Socket Event&quot; above to test.
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950/60"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-neutral-200">{notif.title}</p>
                    <p className="text-xs text-neutral-400">{notif.message}</p>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(notif.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
