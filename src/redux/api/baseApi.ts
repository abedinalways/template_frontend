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
import { API_ENDPOINTS } from "@/constants/routes";
import { tagTypesList } from "./tagTypes";
import { tokenService } from "@/services/auth/tokenService";
import { logOut, setCredentials } from "@/redux/features/auth/authSlice";
import { IApiResponse, IRefreshTokenResponse } from "@/types";

const REQUEST_TIMEOUT_MS = 15000;


const mutex = new Mutex();

function isRefreshTokenSuccessResponse(
  data: unknown
): data is IApiResponse<IRefreshTokenResponse> {
  return (
    typeof data === "object" &&
    data !== null &&
    "data" in data &&
    typeof (data as IApiResponse<IRefreshTokenResponse>).data === "object" &&
    typeof (data as IApiResponse<IRefreshTokenResponse>).data?.accessToken ===
      "string"
  );
}


const rawBaseQuery = fetchBaseQuery({
  baseUrl: ENV.API_URL,
  timeout: REQUEST_TIMEOUT_MS,
  prepareHeaders: (headers) => {
    const accessToken = tokenService.getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
   
    return headers;
  },
});


function buildUnauthorizedError(): { error: FetchBaseQueryError } {
  return {
    error: {
      status: 401,
      data: { message: "Session expired. Please log in again." },
    },
  };
}


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = tokenService.getRefreshToken();

        if (!refreshToken) {
          
          forceLogout(api);
          return buildUnauthorizedError();
        }

        // Execute refresh endpoint without leaking expired Authorization header
        const refreshResult = await rawBaseQuery(
          {
            url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
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
          // Refresh failed or invalid response payload — force logout
          forceLogout(api);
          return buildUnauthorizedError();
        }
      } catch {
        forceLogout(api);
        return buildUnauthorizedError();
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


const forceLogout = (api: BaseQueryApi): void => {
  tokenService.clearAuthCookies();
  api.dispatch(logOut());
  api.dispatch(baseApi.util.resetApiState());
};
