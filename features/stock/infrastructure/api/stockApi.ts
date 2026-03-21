import { httpClient } from "@/infrastructure/http/httpClient"
import type { StockItem } from "../../domain/model/stockItem"

export async function searchStocks(q: string): Promise<StockItem[]> {
    const res = await httpClient.get(`/stocks/search?q=${encodeURIComponent(q)}`)
    return res.json()
}
