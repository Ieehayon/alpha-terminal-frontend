import { clientEnv } from "@/infrastructure/config/env";

export const httpClient = {
  get: (path: string) =>
    fetch(`${clientEnv.apiBaseUrl}${path}`, {
      method: "GET",
      credentials: "include",
    }),

  post: (path: string, body?: unknown) =>
    fetch(`${clientEnv.apiBaseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
};
