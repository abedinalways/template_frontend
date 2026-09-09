export type UserRole = "user" | "admin" | "super_admin";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAuthState {
  token: string | null | false; // false = loading / uninitialized, null = unauthenticated, string = authenticated
  refreshToken: string | null;
  role: UserRole | null;
  user: IUser | null;
  isInitialized: boolean;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken?: string;
  user: IUser;
}

export interface IRefreshTokenResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface IJwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  exp: number;
  iat: number;
}
