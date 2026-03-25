"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchAnalysisLogs, fetchDashboardSummaries, runPipeline } from "../../infrastructure/api/dashboardApi"
import type { AnalysisLog, StockSummary, PipelineResult } from "../../domain/model/stockSummary"

export const useDashboard = () => {
    const [summaries, setSummaries] = useState<StockSummary[]>([])
    const [analysisLogs, setAnalysisLogs] = useState<AnalysisLog[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const [summaryData, logData] = await Promise.all([
                fetchDashboardSummaries(),
                fetchAnalysisLogs(),
            ])
            setSummaries(summaryData)
            setAnalysisLogs(logData)
        } catch {
            setError("데이터를 불러오지 못했습니다.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const executePipeline = useCallback(async (symbols?: string[]) => {
        setError(null)
        setPipelineResult(null)
        try {
            const result = await runPipeline(symbols)
            setPipelineResult(result)
            await new Promise((resolve) => setTimeout(resolve, 500))
            await load()
        } catch {
            setError("파이프라인 실행에 실패했습니다.")
        }
    }, [load])

    return { summaries, analysisLogs, isLoading, error, pipelineResult, executePipeline }
}
