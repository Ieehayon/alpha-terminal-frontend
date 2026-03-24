export interface NewsArticleItem {
    title: string
    snippet: string
    source: string
    published_at: string | null
    link: string | null
}

export interface NewsSearchResponse {
    items: NewsArticleItem[]
    total_count: number
    page: number
    page_size: number
}
