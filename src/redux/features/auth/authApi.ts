import { baseApi } from "@/redux/api/baseApi";
import { TAG_TYPES } from "@/redux/api/tagTypes";
import { API_ENDPOINTS } from "@/constants/routes";
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
        url: API_ENDPOINTS.AUTH.LOGIN,
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
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<IApiResponse<IUser>, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.ME,
        // method: "GET" — RTK Query-এর default, explicitly দেওয়া দরকার নেই
      }),
      providesTags: [TAG_TYPES.User],
    }),

    refreshToken: builder.mutation<
      IApiResponse<IRefreshTokenResponse>,
      { refreshToken: string }
    >({
      query: (body) => ({
        url: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<IApiResponse<null>, void>({
      query: () => ({
        url: API_ENDPOINTS.AUTH.LOGOUT,
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
