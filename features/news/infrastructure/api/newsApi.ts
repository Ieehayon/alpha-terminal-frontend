import { httpClient } from "@/infrastructure/http/httpClient"
import type { NewsSearchResponse } from "@/features/news/domain/model/newsArticle"

export async function searchNews(
    keyword: string,
    market: string | null,
    page: number = 1,
    page_size: number = 10
): Promise<NewsSearchResponse> {
    const params = new URLSearchParams({
        keyword,
        page: String(page),
        page_size: String(page_size),
    })
    if (market) params.set("market", market)
    const res = await httpClient.get(`/news/search?${params.toString()}`)
    return res.json()
}
