import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Layers,
  Lock,
  RefreshCw,
  Radio,
  FolderTree,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 px-4 sm:px-6 container mx-auto text-center space-y-6 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="h-3.5 w-3.5" />
          Production-Ready Next.js Architecture
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Scalable Enterprise Template for{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Next.js 16
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
          Engineered with pure Redux reducers, RTK Query Mutex re-authentication, proactive
          silent token refresh, and a resilient Socket.io lifecycle.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link href={ROUTES.LOGIN}>
            <Button size="lg" className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25">
              <span>Explore Live Demo</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={ROUTES.USER_DASHBOARD}>
            <Button variant="outline" size="lg" className="gap-2">
              <Zap className="h-4 w-4 text-amber-400" />
              <span>User Dashboard</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Feature Pillar Highlights */}
      <section className="w-full py-12 px-4 sm:px-6 container mx-auto max-w-6xl">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Architectural Highlights & Best Practices
          </h2>
          <p className="text-neutral-400 text-sm">
            Addressing all anti-patterns and applying modern enterprise patterns
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-2">
                <Layers className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Pure Redux & Mutex Reauth</CardTitle>
              <CardDescription>
                Zero side-effects in reducers. RTK Query baseApi uses a lightweight Mutex lock to
                prevent race conditions on 401 parallel calls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Single refresh request at a time
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Automatic query retry upon token arrival
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
                <RefreshCw className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Proactive Silent Refresh</CardTitle>
              <CardDescription>
                Tokens are refreshed 60 seconds before expiration via timer and tab visibility
                change listeners.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Resilient to browser sleep & background tabs
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Decoupled tokenService cookie manager
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center mb-2">
                <Radio className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Socket.io Singleton & Lifecycle</CardTitle>
              <CardDescription>
                Singleton socket manager attaches JWT dynamically. Custom useSocket hook guarantees
                auto-cleanup with zero memory leaks.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Connects on login, disconnects on logout
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Typed event contracts
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 4 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center mb-2">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Standard Edge Middleware</CardTitle>
              <CardDescription>
                Proper Next.js middleware.ts guards (auth), (user), and (admin) routes with role-based
                access control at the edge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Zero accidental file name typos
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Clean redirect with return path retention
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 5 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center mb-2">
                <FolderTree className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Clean src/ Structure</CardTitle>
              <CardDescription>
                Unified directories without duplicates (single constants, single ui library, single
                types folder, single lib utilities).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Clear separation of concerns
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Ready to drop into any new project
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Card 6 */}
          <Card className="border-neutral-800 bg-neutral-900/50 hover:border-neutral-700 transition-colors">
            <CardHeader>
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-2">
                <Lock className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-white">Production Guardrails</CardTitle>
              <CardDescription>
                No leftover debug code, fully typed TypeScript contracts, and complete ESLint
                compliance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-xs text-neutral-400 space-y-1.5">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Strict type safety
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  Rich notification toasts via Sonner
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Directory Blueprint Preview */}
      <section className="w-full py-12 px-4 sm:px-6 container mx-auto max-w-4xl border-t border-neutral-800/80">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Template Folder Structure
        </h3>
        <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-900/80 font-mono text-xs text-neutral-300 overflow-x-auto leading-relaxed">
          <pre>{`src/
├── app/
│   ├── (admin)/admin-dashboard/ # Role-protected admin views
│   ├── (auth)/login & register/ # Authentication forms & demo logins
│   ├── (user)/dashboard & profile/ # Protected user zone
│   ├── layout.tsx               # Root layout with AppProviders & Navbar
│   └── page.tsx                 # Landing & template showcase
├── middleware.ts                # Next.js Edge route guard & role verifier
├── redux/
│   ├── api/baseApi.ts           # RTK Query with Mutex re-auth
│   ├── features/auth/           # Pure authSlice & injected authApi
│   ├── features/notification/   # Socket-driven notifications
│   └── store.ts & hooks.ts      # Typed store & hooks
├── services/
│   ├── auth/tokenService.ts     # Pure cookie manager & JWT decoder
│   ├── auth/silentRefresh.ts    # Proactive timer & visibility sync
│   └── socket/socketClient.ts   # Singleton Socket.io client & useSocket
├── providers/
│   ├── AuthProvider.tsx         # Client hydration & silent refresh runner
│   ├── SocketProvider.tsx       # Socket connection lifecycle
│   └── AppProviders.tsx         # Master orchestrator
├── components/ui/               # Reusable UI primitives (Button, Input, Card, Badge)
├── constants/ & types/          # Centralized routes, envs, and TS interfaces
└── lib/utils.ts                 # cn helper & error message extractor`}</pre>
        </div>
      </section>
    </div>
  );
}
