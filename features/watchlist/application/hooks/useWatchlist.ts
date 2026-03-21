"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchWatchlist, addWatchlistItem, deleteWatchlistItem } from "../../infrastructure/api/watchlistApi"
import type { WatchlistItem } from "../../domain/model/watchlistItem"

export const useWatchlist = () => {
    const [items, setItems] = useState<WatchlistItem[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetchWatchlist()
            setItems(data)
        } catch {
            setError("목록을 불러오지 못했습니다.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const add = useCallback(async (symbol: string, name: string, market?: string) => {
        setError(null)
        try {
            const item = await addWatchlistItem(symbol, name, market)
            setItems((prev) => [...prev, item])
            return true
        } catch (err) {
            if (err instanceof Error && err.message.includes("409")) {
                setError("이미 등록된 종목입니다.")
            } else {
                setError("등록에 실패했습니다.")
            }
            return false
        }
    }, [])

    const remove = useCallback(async (id: number) => {
        setError(null)
        try {
            await deleteWatchlistItem(id)
            setItems((prev) => prev.filter((item) => item.id !== id))
        } catch {
            setError("삭제에 실패했습니다.")
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    return { items, isLoading, error, add, remove }
}
