import { tokenService } from "./tokenService";
import { AppDispatch } from "@/redux/store";
import { logOut, setCredentials } from "@/redux/features/auth/authSlice";
import { ENV } from "@/constants/env";
import { IApiResponse, IRefreshTokenResponse } from "@/types";

const REFRESH_BUFFER_MS = 60 * 1000; // Trigger refresh 60s before actual expiry
const MIN_TIMEOUT_MS = 5 * 1000; // Minimum 5s wait time

/**
 * Execute silent token refresh via native fetch to avoid circular dependency with RTK query
 */
export async function executeSilentRefresh(
  dispatch: AppDispatch,
  currentRefreshToken?: string | null
): Promise<boolean> {
  const refreshToken = currentRefreshToken || tokenService.getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const res = await fetch(`${ENV.API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      throw new Error(`Token refresh failed with status: ${res.status}`);
    }

    const data: IApiResponse<IRefreshTokenResponse> = await res.json();
    if (data?.data?.accessToken) {
      const newAccessToken = data.data.accessToken;
      const newRefreshToken = data.data.refreshToken || refreshToken;

      // Update cookies
      tokenService.setTokens(newAccessToken, newRefreshToken);

      // Update pure Redux state
      dispatch(
        setCredentials({
          token: newAccessToken,
          refreshToken: newRefreshToken,
        })
      );
      return true;
    }

    throw new Error("Invalid refresh response format");
  } catch (err) {
    console.error("[SilentRefresh] Token refresh error:", err);
    tokenService.clearAuthCookies();
    dispatch(logOut());
    return false;
  }
}

/**
 * Calculates optimal timeout ms before next token refresh
 */
export function calculateNextRefreshDelay(token: string): number {
  const expiryMs = tokenService.getTokenExpiryMs(token);
  if (!expiryMs) {
    // If token doesn't contain exp, default to 15 minutes
    return 15 * 60 * 1000;
  }

  const now = Date.now();
  const timeUntilRefresh = expiryMs - now - REFRESH_BUFFER_MS;

  // If already expired or within buffer, return minimum delay to run immediately
  return Math.max(timeUntilRefresh, MIN_TIMEOUT_MS);
}
