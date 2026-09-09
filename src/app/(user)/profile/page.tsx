"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import {
  selectCurrentRole,
  selectCurrentUser,
} from "@/redux/features/auth/authSelectors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);
  const role = useAppSelector(selectCurrentRole);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Profile</h1>
        <p className="text-sm text-neutral-400">Your account information from Redux state</p>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/70">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 text-2xl font-bold">
              {user?.name?.[0] || "U"}
            </div>
            <div>
              <CardTitle className="text-xl text-white">{user?.name || "Standard User"}</CardTitle>
              <CardDescription>{user?.email || "user@example.com"}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Shield className="h-3.5 w-3.5 text-blue-400" />
                Role Permission
              </div>
              <Badge variant={role === "admin" ? "warning" : "default"}>
                {role || "user"}
              </Badge>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 bg-neutral-950/50 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                Created At
              </div>
              <p className="text-sm font-medium text-neutral-200">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Today"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
