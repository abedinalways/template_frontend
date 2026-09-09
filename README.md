# Next.js Enterprise Architecture Template

A production-ready, scalable **Next.js 16 (App Router)** template engineered with **Redux Toolkit**, **RTK Query (Mutex Reauth)**, **Authentication (Proactive Silent Refresh)**, **Socket.io-Client**, and a clean **`src/`** directory layout.

---

## 🚀 Key Features & Best Practices

1. **Pure Redux Reducer Pattern**:
   - `authSlice.ts` contains only pure state mutations.
   - All cookie access and storage are decoupled into `tokenService.ts`.

2. **RTK Query Mutex Re-authentication**:
   - Lightweight mutex in `baseApi.ts` blocks duplicate refresh attempts during parallel 401 calls.
   - Pending queries wait and auto-retry once the fresh token is received.

3. **Proactive Silent Token Refresh**:
   - Calculates remaining token lifetime and schedules a refresh 60 seconds before expiration.
   - Automatically checks and syncs token freshness when browser tabs wake from sleep (`visibilitychange` and `focus` events).

4. **Socket.io Client Singleton & Lifecycle**:
   - Singleton client manager (`socketClient.ts`) attaches JWT dynamically.
   - `SocketProvider` connects on login and disconnects on logout.
   - `useSocketEvent` hook guarantees automatic event listener cleanup on component unmount.

5. **Edge Route Protection (`middleware.ts`)**:
   - Edge-level RBAC for `(auth)`, `(user)`, and `(admin)` routes with automatic return URL retention.

6. **Unified Clean Structure**:
   - Standardized `src/` layout without duplicate or conflicting directories.

---

## 📁 Directory Structure

```text
src/
├── app/
│   ├── (admin)/
│   │   └── admin-dashboard/page.tsx # Admin control panel (RBAC protected)
│   ├── (auth)/
│   │   ├── login/page.tsx           # Login page with 1-click demo shortcuts
│   │   └── register/page.tsx        # Registration page
│   ├── (user)/
│   │   ├── dashboard/page.tsx       # User diagnostics & socket playground
│   │   └── profile/page.tsx         # User profile details
│   ├── layout.tsx                   # Master layout with AppProviders & Navbar
│   ├── page.tsx                     # Landing page & feature blueprint
│   └── globals.css                  # Global Tailwind CSS styles
├── middleware.ts                    # Edge-level route protection & redirect guard
├── constants/
│   ├── env.ts                       # Environment variable contracts
│   └── routes.ts                    # Application route paths & role definitions
├── lib/
│   └── utils.ts                     # cn helper and safe API error extractor
├── providers/
│   ├── AppProviders.tsx             # Master composition provider
│   ├── AuthProvider.tsx             # Auth hydration & silent refresh timer
│   └── SocketProvider.tsx           # Socket.io connection lifecycle manager
├── redux/
│   ├── api/
│   │   ├── baseApi.ts               # RTK Query baseApi with Mutex re-auth
│   │   └── tagTypes.ts              # Central cache tags
│   ├── features/
│   │   ├── auth/                    # Pure auth slice, selectors & injected API
│   │   └── notification/            # Real-time notification slice
│   ├── store.ts                     # Typed Redux store
│   ├── hooks.ts                     # Typed useAppDispatch, useAppSelector
│   └── StoreProvider.tsx            # Redux client component wrapper
├── services/
│   ├── auth/
│   │   ├── tokenService.ts          # Pure cookie manager & JWT decoder
│   │   └── silentRefresh.ts         # Proactive refresh scheduler
│   └── socket/
│       ├── socketClient.ts          # Singleton Socket.io client manager
│       └── useSocket.ts             # Custom hook with auto cleanup
├── types/
│   ├── api.ts                       # IApiResponse, IPaginationMeta, IApiError
│   ├── auth.ts                      # IUser, UserRole, IAuthState, IJwtPayload
│   ├── socket.ts                    # ServerToClientEvents, ClientToServerEvents
│   └── index.ts                     # Central barrel export
└── components/
    ├── layout/Navbar.tsx            # Header with live socket beacon & auth menu
    └── ui/                          # Reusable UI primitives (Button, Input, Card, Badge)
```

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Demo Credentials
On the Login page (`/login`), you can use the 1-click demo buttons:
* **User Mode**: Logs in as standard user and routes to `/dashboard`.
* **Admin Mode**: Logs in as administrator and grants access to `/admin-dashboard`.
# template_frontend
