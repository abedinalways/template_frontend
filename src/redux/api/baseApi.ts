import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { ENV } from "@/constants/env";
import { tagTypesList } from "./tagTypes";
import { tokenService } from "@/services/auth/tokenService";
import { logOut, setCredentials } from "../features/auth/authSlice";
import { IApiResponse, IRefreshTokenResponse } from "@/types";

/**
 * Lightweight Mutex implementation to prevent race-conditions
 * during parallel 401 token refresh attempts.
 */
class MutexLock {
  private _isLocked = false;
  private _waiters: Array<() => void> = [];

  isLocked(): boolean {
    return this._isLocked;
  }

  async acquire(): Promise<() => void> {
    if (this._isLocked) {
      await new Promise<void>((resolve) => this._waiters.push(resolve));
    }
    this._isLocked = true;
    let released = false;
    return () => {
      if (released) return;
      released = true;
      this._isLocked = false;
      const next = this._waiters.shift();
      if (next) next();
    };
  }

  async waitForUnlock(): Promise<void> {
    while (this._isLocked) {
      await new Promise<void>((resolve) => this._waiters.push(resolve));
    }
  }
}

const mutex = new MutexLock();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  prepareHeaders: (headers) => {
    const token = tokenService.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // Wait if another request is currently refreshing the token
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          tokenService.clearAuthCookies();
          api.dispatch(logOut());
          return result;
        }

        // Call the refresh endpoint
        const refreshResult = await rawBaseQuery(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        const responseData = refreshResult.data as IApiResponse<IRefreshTokenResponse>;

        if (responseData?.data?.accessToken) {
          const newAccessToken = responseData.data.accessToken;
          const newRefreshToken = responseData.data.refreshToken || refreshToken;

          // Update cookies & Redux state cleanly
          tokenService.setTokens(newAccessToken, newRefreshToken);
          api.dispatch(
            setCredentials({
              token: newAccessToken,
              refreshToken: newRefreshToken,
            })
          );

          // Retry the original query with the refreshed access token
          result = await rawBaseQuery(args, api, extraOptions);
        } else {
          // Refresh failed - log out user
          tokenService.clearAuthCookies();
          api.dispatch(logOut());
        }
      } catch {
        tokenService.clearAuthCookies();
        api.dispatch(logOut());
      } finally {
        release();
      }
    } else {
      // Another request already triggered refresh, wait until it finishes and retry
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
