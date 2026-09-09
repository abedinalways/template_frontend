import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { AUTH_COOKIE_KEYS } from "@/constants/routes";
import { IJwtPayload, IUser, UserRole } from "@/types/auth";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

export const tokenService = {
  getAccessToken(): string | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken(): string | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.REFRESH_TOKEN);
  },

  getUserRole(): UserRole | undefined {
    return Cookies.get(AUTH_COOKIE_KEYS.ROLE) as UserRole | undefined;
  },

  getUserInfo(): IUser | null {
    const raw = Cookies.get(AUTH_COOKIE_KEYS.USER_INFO);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  setTokens(accessToken: string, refreshToken?: string, user?: IUser): void {
    // 7 days expiration for access cookie default, or session
    Cookies.set(AUTH_COOKIE_KEYS.ACCESS_TOKEN, accessToken, {
      ...COOKIE_OPTIONS,
      expires: 7,
    });

    if (refreshToken) {
      Cookies.set(AUTH_COOKIE_KEYS.REFRESH_TOKEN, refreshToken, {
        ...COOKIE_OPTIONS,
        expires: 30, // 30 days
      });
    }

    if (user) {
      Cookies.set(AUTH_COOKIE_KEYS.ROLE, user.role, {
        ...COOKIE_OPTIONS,
        expires: 7,
      });
      Cookies.set(AUTH_COOKIE_KEYS.USER_INFO, JSON.stringify(user), {
        ...COOKIE_OPTIONS,
        expires: 7,
      });
    }
  },

  clearAuthCookies(): void {
    Cookies.remove(AUTH_COOKIE_KEYS.ACCESS_TOKEN, { path: "/" });
    Cookies.remove(AUTH_COOKIE_KEYS.REFRESH_TOKEN, { path: "/" });
    Cookies.remove(AUTH_COOKIE_KEYS.ROLE, { path: "/" });
    Cookies.remove(AUTH_COOKIE_KEYS.USER_INFO, { path: "/" });
  },

  decodeToken(token: string): IJwtPayload | null {
    try {
      return jwtDecode<IJwtPayload>(token);
    } catch {
      return null;
    }
  },

  getTokenExpiryMs(token: string): number | null {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return null;
    return decoded.exp * 1000;
  },

  isTokenExpired(token: string, bufferSeconds = 30): boolean {
    const expiryMs = this.getTokenExpiryMs(token);
    if (!expiryMs) return false;
    return Date.now() >= expiryMs - bufferSeconds * 1000;
  },
};
