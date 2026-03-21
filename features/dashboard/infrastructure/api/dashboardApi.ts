import { httpClient } from "@/infrastructure/http/httpClient"
import type { StockSummary, PipelineResult } from "../../domain/model/stockSummary"

export async function fetchDashboardSummaries(): Promise<StockSummary[]> {
    const res = await httpClient.get("/pipeline/summaries")
    return res.json()
}

export async function runPipeline(): Promise<PipelineResult> {
    const res = await httpClient.post("/pipeline/run")
    return res.json()
}
