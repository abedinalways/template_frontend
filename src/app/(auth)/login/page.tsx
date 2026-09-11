"use client";

import React, { Suspense, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/features/auth/authSlice";
import { tokenService } from "@/services/auth/tokenService";
import { ROUTES, USER_ROLES } from "@/constants/routes";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Lock, ShieldCheck, UserCheck, ArrowRight } from "lucide-react";
import { IUser, UserRole } from "@/types/auth";

// --- Inner component that consumes useSearchParams (must be inside Suspense) ---
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const redirectPath = searchParams.get("redirect") || ROUTES.USER_DASHBOARD;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Prevents calling setState after the component unmounts (e.g. fast navigation)
  const isMountedRef = useRef(true);
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Simulates a login flow for template demo purposes.
   * In a real app, replace the body with: const result = await loginMutation(credentials);
   */
  const executeLogin = (userPayload: IUser, role: UserRole) => {
    setIsLoading(true);

    // Mock realistic JWT token for template demonstration.
    // Encodes a valid JWT expiration time 1 hour into the future.
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(
      JSON.stringify({
        userId: userPayload._id,
        email: userPayload.email,
        role: userPayload.role,
        exp: Math.floor(Date.now() / 1000) + 3600,
        iat: Math.floor(Date.now() / 1000),
      })
    );
    const mockAccessToken = `${header}.${payload}.mockSignatureSignature`;
    const mockRefreshToken = `refresh_${Math.random().toString(36).substring(2)}`;

    // Simulate async round-trip. Guard with isMountedRef to prevent
    // setState calls on an already-unmounted component.
    setTimeout(() => {
      if (!isMountedRef.current) return;

      // 1. Decoupled side-effect: save to cookies securely
      tokenService.setTokens(mockAccessToken, mockRefreshToken, userPayload);

      // 2. Update pure Redux store state
      dispatch(
        setCredentials({
          token: mockAccessToken,
          refreshToken: mockRefreshToken,
          role: role,
          user: userPayload,
        })
      );

      setIsLoading(false);
      toast.success(`Logged in as ${userPayload.name} (${role})`);

      if (role === USER_ROLES.ADMIN || role === USER_ROLES.SUPER_ADMIN) {
        router.push(ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(redirectPath);
      }
    }, 600);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const role: UserRole = email.includes("admin") ? USER_ROLES.ADMIN : USER_ROLES.USER;
    const userPayload: IUser = {
      _id: "usr_" + Math.random().toString(36).substring(2, 9),
      name: email.split("@")[0].toUpperCase(),
      email,
      role,
    };

    executeLogin(userPayload, role);
  };

  const handleDemoUserLogin = () => {
    executeLogin(
      {
        _id: "usr_user_123",
        name: "Standard User",
        email: "user@example.com",
        role: USER_ROLES.USER,
      },
      USER_ROLES.USER
    );
  };

  const handleDemoAdminLogin = () => {
    executeLogin(
      {
        _id: "usr_admin_999",
        name: "Administrator",
        email: "admin@example.com",
        role: USER_ROLES.ADMIN,
      },
      USER_ROLES.ADMIN
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-800 bg-neutral-900/90 shadow-2xl backdrop-blur-sm">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 border border-blue-500/20">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-neutral-400">
            Sign in to access your protected dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 1-Click Quick Demo Login Shortcuts */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 space-y-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider text-center">
              Quick 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoUserLogin}
                isLoading={isLoading}
                className="gap-1.5 text-xs border border-neutral-700/60 hover:border-neutral-600"
              >
                <UserCheck className="h-3.5 w-3.5 text-blue-400" />
                User Mode
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDemoAdminLogin}
                isLoading={isLoading}
                className="gap-1.5 text-xs border border-amber-800/40 hover:border-amber-700/60 text-amber-300"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                Admin Mode
              </Button>
            </div>
          </div>

          <div className="relative flex items-center justify-center text-xs uppercase text-neutral-500">
            <div className="w-full border-t border-neutral-800" />
            <span className="bg-neutral-900 px-2 text-neutral-400">Or credentials</span>
            <div className="w-full border-t border-neutral-800" />
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="user@example.com or admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              className="w-full mt-2 gap-2 bg-blue-600 hover:bg-blue-500 text-white"
              isLoading={isLoading}
            >
              <span>Sign In</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 text-center text-xs text-neutral-400">
          <div>
            Don&apos;t have an account?{" "}
            <Link
              href={ROUTES.REGISTER}
              className="font-medium text-blue-400 hover:underline hover:text-blue-300"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// --- Page shell wraps LoginForm in Suspense so useSearchParams is safe ---
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
