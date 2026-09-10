import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import { ENV } from "@/constants/env";
import { tagTypesList } from "./tagTypes";
import { tokenService } from "@/services/auth/tokenService";
import { logOut, setCredentials } from "@/redux/features/auth/authSlice";
import { IApiResponse, IRefreshTokenResponse } from "@/types";

/**
 * Network timeout configuration (15 seconds) to prevent requests
 * from hanging indefinitely on slow or unstable network connections.
 */
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Mutex to prevent race-conditions during parallel 401 token refresh
 * attempts. Uses `async-mutex` because it notifies ALL unlock-waiters
 * on release — a hand-rolled FIFO queue would leave requests stuck
 * pending forever when 3+ parallel requests hit a 401 at once.
 */
const mutex = new Mutex();

/**
 * Type Guard to safely validate the refresh token API response structure at runtime.
 */
function isRefreshTokenSuccessResponse(
  data: unknown
): data is IApiResponse<IRefreshTokenResponse> {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    typeof (data as IApiResponse<IRefreshTokenResponse>).data === "object"
  );
}

/**
 * Raw BaseQuery configured with Base URL, Request Timeout, and Authorization Header injection.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    // No manual "Content-Type" here: RTK Query sets it automatically for JSON
    // bodies and leaves FormData untouched (so file uploads keep working).
    return headers;
  },
});

/**
 * Centralized logout: clears auth cookies, resets the auth slice and
 * purges all cached RTK Query data so nothing from the previous
 * session leaks into the next one.
 */
const forceLogout = (api: BaseQueryApi): void => {
  tokenService.clearAuthCookies();
  api.dispatch(logOut());
  api.dispatch(baseApi.util.resetApiState());
};

/**
 * Custom BaseQuery wrapper with Mutex-protected automatic token re-authentication.
 */
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if another request is actively performing a token refresh
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          forceLogout(api);
          return result;
        }

        // Execute refresh endpoint without leaking expired Authorization header
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
            headers: { Authorization: "" },
          },
          api,
          extraOptions
        );

        if (
          refreshResult.data &&
          isRefreshTokenSuccessResponse(refreshResult.data)
        ) {
          const { accessToken: newAccessToken, refreshToken: fetchedRefreshToken } =
            refreshResult.data.data;

          const newRefreshToken = fetchedRefreshToken || refreshToken;

          // Update tokens in cookies & Redux state cleanly
          tokenService.setTokens(newAccessToken, newRefreshToken);
          api.dispatch(
            setCredentials({
              token: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          // Retry the original query with the new access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh failed or invalid response payload - force logout
          forceLogout(api);
        }
      } catch {
        forceLogout(api);
      } finally {
        release();
      }
    } else {
      // Another request already triggered a refresh — wait for it to finish,
      // then retry the original query once with the fresh token.
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: tagTypesList,
  endpoints: () => ({}),
});

