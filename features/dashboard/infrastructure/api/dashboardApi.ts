import { httpClient } from "@/infrastructure/http/httpClient"
import type { AnalysisLog, StockSummary, PipelineResult } from "../../domain/model/stockSummary"

export async function fetchDashboardSummaries(): Promise<StockSummary[]> {
    const res = await httpClient.get("/pipeline/summaries")
    return res.json()
}

export async function runPipeline(symbols?: string[]): Promise<PipelineResult> {
    const body = symbols && symbols.length > 0 ? { symbols } : undefined
    const res = await httpClient.post("/pipeline/run", body)
    return res.json()
}

export async function fetchAnalysisLogs(): Promise<AnalysisLog[]> {
    const res = await httpClient.get("/pipeline/logs")
    return res.json()
}
