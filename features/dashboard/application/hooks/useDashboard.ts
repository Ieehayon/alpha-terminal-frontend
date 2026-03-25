"use client"

import { useState, useEffect, useCallback } from "react"
import { ApiError } from "@/infrastructure/http/apiError"
import type { PipelineProgressEvent } from "../../domain/model/pipelineProgressEvent"
import {
    fetchAnalysisLogs,
    fetchDashboardSummaries,
    fetchPipelineProgress,
    fetchReportSummaries,
    runPipeline,
} from "../../infrastructure/api/dashboardApi"
import type { AnalysisLog, StockSummary, PipelineResult } from "../../domain/model/stockSummary"

function formatLoadError(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 401) return "로그인이 필요합니다. 다시 로그인해 주세요."
        return err.message || "데이터를 불러오지 못했습니다."
    }
    return "데이터를 불러오지 못했습니다."
}

function formatPipelineError(err: unknown): string {
    if (err instanceof ApiError) {
        if (err.status === 401) return "로그인이 만료되었습니다. 다시 로그인해 주세요."
        return err.message || "파이프라인 실행에 실패했습니다."
    }
    return "파이프라인 실행에 실패했습니다."
}

export const useDashboard = () => {
    const [summaries, setSummaries] = useState<StockSummary[]>([])
    const [reportSummaries, setReportSummaries] = useState<StockSummary[]>([])
    const [analysisLogs, setAnalysisLogs] = useState<AnalysisLog[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [pipelineResult, setPipelineResult] = useState<PipelineResult | null>(null)
    const [progressEvents, setProgressEvents] = useState<PipelineProgressEvent[]>([])
    const [elapsedSeconds, setElapsedSeconds] = useState<number | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const [summaryData, reportData, logData] = await Promise.all([
                fetchDashboardSummaries(),
                fetchReportSummaries(),
                fetchAnalysisLogs(),
            ])
            setSummaries(summaryData)
            setReportSummaries(reportData)
            setAnalysisLogs(logData)
        } catch (err) {
            setError(formatLoadError(err))
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
        setProgressEvents([])
        setElapsedSeconds(null)

        const startedAt = Date.now()
        let polling = true

        // /pipeline/progress 폴링 — 1.5초마다 메시지 갱신
        const pollInterval = setInterval(async () => {
            if (!polling) return
            try {
                const progress = await fetchPipelineProgress()
                const events: PipelineProgressEvent[] = progress.messages.map((msg) => ({
                    type: "progress",
                    at: new Date().toISOString(),
                    message: msg,
                }))
                setProgressEvents(events)
                if (progress.done) {
                    polling = false
                    clearInterval(pollInterval)
                }
            } catch {
                // 폴링 오류는 무시 (파이프라인 실행 중 일시적 실패 가능)
            }
        }, 1500)

        try {
            const result = await runPipeline(symbols)
            polling = false
            clearInterval(pollInterval)
            setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000))
            setPipelineResult(result)
            await load()
            setProgressEvents([])
        } catch (err) {
            polling = false
            clearInterval(pollInterval)
            setElapsedSeconds(Math.round((Date.now() - startedAt) / 1000))
            setError(formatPipelineError(err))
            setProgressEvents([])
        }
    }, [load])

    return {
        summaries,
        reportSummaries,
        analysisLogs,
        isLoading,
        error,
        pipelineResult,
        progressEvents,
        elapsedSeconds,
        executePipeline,
        reload: load,
    }
}
