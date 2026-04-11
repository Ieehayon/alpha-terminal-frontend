"use client"

import { useCallback, useEffect, useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { ApiError } from "@/infrastructure/http/apiError"
import { isLoggedInAtom } from "@/features/auth/application/selectors/authSelectors"
import { fetchWatchlist } from "@/features/watchlist/infrastructure/api/watchlistApi"
import { searchNews, saveArticle } from "@/features/news/infrastructure/api/newsApi"
import { newsListAtom } from "@/features/news/application/atoms/newsListAtom"
import { createNewsCommand } from "@/features/news/application/commands/newsCommand"
import type { NewsIntent } from "@/features/news/domain/intent/newsIntent"
import type { NewsArticleItem, NewsSearchResponse, SaveArticleRequest } from "@/features/news/domain/model/newsArticle"

const PAGE_SIZE = 10
const MAX_KEYWORD_ITEMS = 5

const KR_MARKETS = ["KOSDAQ", "KOSPI", "KR"]

export type MarketFilter = "ALL" | "KR" | "US"

interface MarketKeywords {
    kr: string | null
    us: string | null
}

async function buildMarketKeywords(): Promise<MarketKeywords> {
    try {
        const items = await fetchWatchlist()
        const krItems = items.filter((i) => KR_MARKETS.includes((i.market ?? "").toUpperCase()))
        const usItems = items.filter((i) => !KR_MARKETS.includes((i.market ?? "").toUpperCase()))

        const toKeyword = (list: typeof items, max: number) =>
            list.length === 0
                ? null
                : list
                      .slice(0, max)
                      .map((i) => `"${i.name || i.symbol}"`)
                      .join(" OR ")

        return {
            kr: toKeyword(krItems, MAX_KEYWORD_ITEMS),
            us: toKeyword(usItems, MAX_KEYWORD_ITEMS),
        }
    } catch {
        return { kr: null, us: "stock" }
    }
}

export function useNewsList() {
    const isLoggedIn = useAtomValue(isLoggedInAtom)
    const [state, setState] = useAtom(newsListAtom)
    const [marketFilter, setMarketFilter] = useState<MarketFilter>("ALL")

    const fetchPage = useCallback(async (page: number, market: MarketFilter) => {
        setState((s) => ({ ...s, isLoading: true, error: null, page }))

        try {
            const { kr, us } = await buildMarketKeywords()

            const calls: Promise<NewsSearchResponse>[] = []
            if (market !== "US" && kr) calls.push(searchNews(kr, "KR", page, PAGE_SIZE))
            if (market !== "KR" && us) calls.push(searchNews(us, "US", page, PAGE_SIZE))
            if (calls.length === 0) calls.push(searchNews("stock", null, page, PAGE_SIZE))

            const results = await Promise.all(calls)

            const seenLinks = new Set<string>()
            const merged = results
                .flatMap((r) => r.items)
                .filter((item) => {
                    if (seenLinks.has(item.link ?? "")) return false
                    seenLinks.add(item.link ?? "")
                    return true
                })

            const totalCount = results.reduce((sum, r) => sum + r.total_count, 0)

            setState({
                items: merged,
                totalCount,
                page,
                pageSize: PAGE_SIZE,
                isLoading: false,
                error: null,
            })
        } catch (err) {
            const message =
                err instanceof ApiError
                    ? err.message || "뉴스를 불러오지 못했습니다."
                    : "뉴스를 불러오지 못했습니다."
            setState((s) => ({ ...s, isLoading: false, error: message, items: [] }))
        }
    }, [setState])

    const dispatch = useCallback(
        (intent: NewsIntent) => {
            const commands = createNewsCommand((page) => fetchPage(page, marketFilter))
            commands[intent.type](intent)
        },
        [fetchPage, marketFilter],
    )

    const changePage = useCallback(
        (page: number) => dispatch({ type: "CHANGE_PAGE", page }),
        [dispatch],
    )

    const changeMarket = useCallback(
        (market: MarketFilter) => {
            setMarketFilter(market)
        },
        [],
    )

    const save = useCallback(async (article: NewsArticleItem): Promise<"ok" | "duplicate" | "error"> => {
        const req: SaveArticleRequest = {
            title: article.title,
            link: article.link ?? "",
            source: article.source,
            snippet: article.snippet,
            published_at: article.published_at,
            content: null,
        }
        try {
            await saveArticle(req)
            return "ok"
        } catch (err) {
            if (err instanceof ApiError && err.status === 409) return "duplicate"
            return "error"
        }
    }, [])

    useEffect(() => {
        if (isLoggedIn) {
            fetchPage(1, marketFilter)
        } else {
            setState((s) => ({ ...s, error: "로그인이 필요합니다.", items: [], isLoading: false }))
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoggedIn, marketFilter])

    const totalPages = Math.max(1, Math.ceil(state.totalCount / state.pageSize))
    const rangeStart = state.totalCount === 0 ? 0 : (state.page - 1) * state.pageSize + 1
    const rangeEnd = Math.min(state.page * state.pageSize, state.totalCount)

    return {
        ...state,
        totalPages,
        rangeStart,
        rangeEnd,
        marketFilter,
        changeMarket,
        changePage,
        save,
    }
}
