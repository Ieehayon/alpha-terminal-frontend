import type { NewsIntent } from "@/features/news/domain/intent/newsIntent"

type FetchFn = (page: number) => void

export function createNewsCommand(fetch: FetchFn): Record<NewsIntent["type"], (intent: NewsIntent) => void> {
    return {
        FETCH_NEWS_LIST: (intent) => {
            if (intent.type === "FETCH_NEWS_LIST") fetch(intent.page)
        },
        CHANGE_PAGE: (intent) => {
            if (intent.type === "CHANGE_PAGE") fetch(intent.page)
        },
    }
}
