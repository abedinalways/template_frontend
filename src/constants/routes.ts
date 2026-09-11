export const ROUTES = {
  // Public
  HOME: "/",
  
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",

  // User
  USER_DASHBOARD: "/dashboard",
  USER_PROFILE: "/profile",

  // Admin
  ADMIN_DASHBOARD: "/admin-dashboard",
  ADMIN_USERS: "/admin-dashboard/users",
} as const;

export const AUTH_COOKIE_KEYS = {
  ACCESS_TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  ROLE: "role",
  USER_INFO: "user_info",
} as const;

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
} as const;
