import { env } from "@/infrastructure/config/env"
import { readApiError } from "./apiError"

async function ensureOk(res: Response): Promise<Response> {
    if (!res.ok) throw await readApiError(res)
    return res
}

export const httpClient = {
    get: async (path: string) => {
        const res = await fetch(`${env.apiBaseUrl}${path}`, {
            method: "GET",
            credentials: "include",
        })
        return ensureOk(res)
    },

    post: async (path: string, body?: unknown) => {
        const res = await fetch(`${env.apiBaseUrl}${path}`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
        return ensureOk(res)
    },

    put: async (path: string, body?: unknown) => {
        const res = await fetch(`${env.apiBaseUrl}${path}`, {
            method: "PUT",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
        return ensureOk(res)
    },

    delete: async (path: string) => {
        const res = await fetch(`${env.apiBaseUrl}${path}`, {
            method: "DELETE",
            credentials: "include",
        })
        return ensureOk(res)
    },
}
