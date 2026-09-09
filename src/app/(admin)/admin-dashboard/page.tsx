"use client";

import React from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentRole } from "@/redux/features/auth/authSelectors";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Shield, Users, Server, Activity, Lock, Database } from "lucide-react";

export default function AdminDashboardPage() {
  const role = useAppSelector(selectCurrentRole);

  const handleBroadcast = () => {
    toast.success("Broadcast message sent to all active socket clients!");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Admin Control Center
            </h1>
            <Badge variant="warning" className="gap-1">
              <Shield className="h-3 w-3" />
              Role: {role || "admin"}
            </Badge>
          </div>
          <p className="text-sm text-neutral-400 mt-1">
            Privileged edge-guarded zone (accessible only by admin and super_admin)
          </p>
        </div>

        <Button
          variant="default"
          size="sm"
          onClick={handleBroadcast}
          className="gap-2 bg-amber-600 hover:bg-amber-500 text-white"
        >
          <Activity className="h-4 w-4" />
          Broadcast System Notice
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Managed Users</span>
              <Users className="h-4 w-4 text-blue-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-white">1,482</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-400">+12% increase this month</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>Edge Middleware Gate</span>
              <Lock className="h-4 w-4 text-amber-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-emerald-400">Strict</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-neutral-400">Enforcing RBAC on all admin routes</p>
          </CardContent>
        </Card>

        <Card className="border-neutral-800 bg-neutral-900/60">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between text-xs">
              <span>RTK Query Cache</span>
              <Database className="h-4 w-4 text-purple-400" />
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-white">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-purple-400">Optimistic tags & Mutex reauth</p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Action Card */}
      <Card className="border-neutral-800 bg-neutral-900/40">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4 text-amber-400" />
            System Architecture Guard
          </CardTitle>
          <CardDescription>
            How this route was reached and protected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-neutral-300">
          <p>
            When you navigated to <code className="text-amber-400 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">/admin-dashboard</code>, the Next.js edge <code className="text-blue-400 bg-neutral-800 px-1.5 py-0.5 rounded text-xs">middleware.ts</code> checked your cookie credentials:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-400 pl-2">
            <li>Checked for valid <code className="text-neutral-200">token</code> cookie.</li>
            <li>Verified that <code className="text-neutral-200">role === &quot;admin&quot; | &quot;super_admin&quot;</code>.</li>
            <li>If unauthenticated, you would be bounced to <code className="text-neutral-200">/login?redirect=/admin-dashboard</code>.</li>
            <li>If authenticated as standard user, you would be deflected to <code className="text-neutral-200">/dashboard?error=forbidden</code>.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
