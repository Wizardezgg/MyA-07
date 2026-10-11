import { betterAuth } from "better-auth";

const getBaseUrl = () => {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "https://bazardorwz.vercel.app";
};

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "bazardor-super-secret-key-at-least-32-chars-long",
  baseURL: getBaseUrl(),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-client-secret",
      enabled: true,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-client-secret",
      enabled: true,
    },
  },
});
