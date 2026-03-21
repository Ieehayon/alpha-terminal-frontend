"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchDashboardSummaries, runPipeline } from "../../infrastructure/api/dashboardApi"
import type { StockSummary, PipelineResult } from "../../domain/model/stockSummary"

export const useDashboard = () => {
    const [summaries, setSummaries] = useState<StockSummary[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const data = await fetchDashboardSummaries()
            setSummaries(data)
        } catch {
            setError("데이터를 불러오지 못했습니다.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const executePipeline = useCallback(async () => {
        setError(null)
        setPipelineResult(null)
        try {
            const result = await runPipeline()
            setPipelineResult(result)
            await new Promise((resolve) => setTimeout(resolve, 500))
            await load()
        } catch {
            setError("파이프라인 실행에 실패했습니다.")
        }
    }, [load])

    return { summaries, isLoading, error, pipelineResult, executePipeline }
}
