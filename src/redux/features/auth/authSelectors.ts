import { RootState } from "@/redux/store";

export const selectCurrentToken = (state: RootState) => state.auth.token;
export const selectCurrentRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectCurrentRole = (state: RootState) => state.auth.role;
export const selectIsAuthInitialized = (state: RootState) => state.auth.isInitialized;
export const selectIsAuthenticated = (state: RootState) => Boolean(state.auth.token);
