"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentRole,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/redux/features/auth/authSelectors";
import { logOut } from "@/redux/features/auth/authSlice";
import { baseApi } from "@/redux/api/baseApi";
import { tokenService } from "@/services/auth/tokenService";
import { useSocketContext } from "@/providers/SocketProvider";
import { ROUTES, USER_ROLES } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Shield } from "lucide-react";

export function Navbar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentRole);
  const { isConnected } = useSocketContext();

  const handleLogout = () => {
    // 1. Clear cookies
    tokenService.clearAuthCookies();
    // 2. Clear pure Redux state
    dispatch(logOut());
    // 3. Purge all RTK Query cache — prevents previous user's data leaking to next session
    dispatch(baseApi.util.resetApiState());
    toast.success("Logged out successfully");
    router.push(ROUTES.LOGIN);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href={ROUTES.HOME} className="flex items-center gap-2 font-bold text-lg text-neutral-900 dark:text-white">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-black text-base shadow-sm">
              T
            </div>
            <span>NextTemplate</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium text-neutral-600 dark:text-neutral-400">
            <Link href={ROUTES.HOME} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
              Overview
            </Link>
            {isAuthenticated && (
              <>
                <Link href={ROUTES.USER_DASHBOARD} className="hover:text-neutral-900 dark:hover:text-white transition-colors">
                  Dashboard
                </Link>
                {(role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN) && (
                  <Link href={ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline">
                    <Shield className="h-3.5 w-3.5" />
                    Admin Panel
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Live Socket Status Beacon */}
              <div
                title={isConnected ? "Socket.io: Connected" : "Socket.io: Disconnected"}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
              >
                <span className="relative flex h-2 w-2">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isConnected ? "bg-emerald-500" : "bg-neutral-400"
                    }`}
                  ></span>
                </span>
                <span className="text-[11px] text-neutral-600 dark:text-neutral-400 hidden sm:inline">
                  {isConnected ? "Live Socket" : "Socket Idle"}
                </span>
              </div>

              {/* User Role Badge */}
              <Badge variant={role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN ? "warning" : "default"}>
                {role || "user"}
              </Badge>

              {/* User Details */}
              <div className="hidden lg:flex flex-col text-right">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                  {user?.name || "Member"}
                </span>
                <span className="text-[10px] text-neutral-500 truncate max-w-[140px]">
                  {user?.email || "user@example.com"}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="gap-1.5 text-neutral-700 dark:text-neutral-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href={ROUTES.REGISTER}>
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
