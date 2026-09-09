import { baseApi } from "@/redux/api/baseApi";
import { TAG_TYPES } from "@/redux/api/tagTypes";
import {
  IApiResponse,
  ILoginResponse,
  IRefreshTokenResponse,
  IUser,
} from "@/types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<
      IApiResponse<ILoginResponse>,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [TAG_TYPES.Auth, TAG_TYPES.User],
    }),

    register: builder.mutation<
      IApiResponse<{ user: IUser }>,
      { name: string; email: string; password: string; role?: string }
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: [TAG_TYPES.User],
    }),

    refreshToken: builder.mutation<
      IApiResponse<IRefreshTokenResponse>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh-token",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [TAG_TYPES.Auth, TAG_TYPES.User],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;
