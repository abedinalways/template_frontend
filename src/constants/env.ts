export const ENV = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com/api/v1",
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.example.com",
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Next.js App",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  IS_DEVELOPMENT: process.env.NODE_ENV === "development",
} as const;
