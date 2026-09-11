import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAuthState, IUser, UserRole } from "@/types/auth";

const initialState: IAuthState = {
  token: null, // null = not yet checked (see isInitialized) OR logged out
  refreshToken: null,
  role: null,
  user: null,
  isInitialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set credentials purely in state (Side-effects like cookie storage handled in service/thunk)
    setCredentials: (
      state,
      action: PayloadAction<{
        token: string | null;
        refreshToken?: string | null;
        role?: UserRole | null;
        user?: IUser | null;
      }>
    ) => {
      state.token = action.payload.token;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.role !== undefined) {
        state.role = action.payload.role;
      }
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      state.isInitialized = true;
    },

    // Update only user profile information
    setUser: (state, action: PayloadAction<IUser | null>) => {
      state.user = action.payload;
      if (action.payload?.role) {
        state.role = action.payload.role;
      }
      state.isInitialized = true;
    },

    // Pure logout action resetting auth state to unauthenticated
    logOut: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.role = null;
      state.user = null;
      state.isInitialized = true;
    },
  },
});

export const { setCredentials, setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
