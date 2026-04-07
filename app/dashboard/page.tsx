"use client"

import { useEffect, useMemo, useState } from "react"
import { useDashboard } from "@/features/dashboard/application/hooks/useDashboard"
import { excludeCurrentSummaryFromLogs } from "@/features/dashboard/domain/excludeCurrentSummaryFromLogs"
import { useDailyReturnsHeatmap } from "@/features/stock/application/hooks/useDailyReturnsHeatmap"
import { useWatchlist } from "@/features/watchlist/application/hooks/useWatchlist"
import { useAuth } from "@/features/auth/application/hooks/useAuth"
import { DashboardAnalysisLogsSection } from "./components/DashboardAnalysisLogsSection"
import { DashboardPipelineResult } from "./components/DashboardPipelineResult"
import { DashboardSummarySection } from "./components/DashboardSummarySection"
import { DashboardWatchlistSection } from "./components/DashboardWatchlistSection"

export default function DashboardPage() {
    const { state: authState } = useAuth()
    const isLoggedIn = authState.status === "AUTHENTICATED"
    const {
        summaries,
        reportSummaries,
        analysisLogs,
        isLoading: isSummaryLoading,
        error: summaryError,
        pipelineResult,
        progressEvents,
        elapsedSeconds,
        executePipeline,
        reload,
    } = useDashboard()
    const { items, isLoading: isWatchlistLoading, error: watchlistError } = useWatchlist()
    const [running, setRunning] = useState(false)
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
    const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

    useEffect(() => {
        const itemSymbols = items.map((item) => item.symbol)

        if (itemSymbols.length === 0) {
            setSelectedSymbols([])
            setHasInitializedSelection(false)
            return
        }

        setSelectedSymbols((prev) => {
            if (!hasInitializedSelection) return itemSymbols
            return prev.filter((symbol) => itemSymbols.includes(symbol))
        })
        setHasInitializedSelection(true)
    }, [items, hasInitializedSelection])

    const selectedCount = selectedSymbols.length
    const allSelected = items.length > 0 && selectedCount === items.length

    const handleSelectSymbol = (symbol: string, checked: boolean) => {
        setSelectedSymbols((prev) => {
            if (checked) {
                return prev.includes(symbol) ? prev : [...prev, symbol]
            }
            return prev.filter((item) => item !== symbol)
        })
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedSymbols(checked ? items.map((item) => item.symbol) : [])
    }

    const handleRunPipeline = async () => {
        if (selectedSymbols.length === 0) return
        setRunning(true)
        try {
            await executePipeline(selectedSymbols)
        } finally {
            setRunning(false)
        }
    }

    const allSkipped = pipelineResult ? pipelineResult.processed.every((p) => p.skipped) : false
    const canRun = selectedSymbols.length > 0

    const analysisLogsForDisplay = useMemo(
        () => excludeCurrentSummaryFromLogs(analysisLogs, summaries),
        [analysisLogs, summaries],
    )

    const heatmapSymbols = useMemo(() => {
        const ids = new Set<string>()
        for (const s of summaries) {
            ids.add(s.symbol.trim().toUpperCase())
        }
        for (const l of analysisLogsForDisplay) {
            ids.add(l.symbol.trim().toUpperCase())
        }
        return Array.from(ids)
    }, [summaries, analysisLogsForDisplay])

    const { bySymbol: heatmapBySymbol, data: heatmapData } = useDailyReturnsHeatmap(heatmapSymbols, 6)

    return (
        <main
            className="max-w-6xl mx-auto p-6 pt-8 md:p-8"
            aria-busy={running}
        >
            <header className="mb-6 flex items-center justify-between border-b border-outline pb-4">
                <div>
                    <div className="font-headline font-bold text-on-surface text-xl uppercase tracking-tighter">
                        DASHBOARD
                    </div>
                    <div className="font-mono text-sm text-on-surface-variant mt-0.5">
                        관심종목 AI 분석 요약
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleRunPipeline}
                    disabled={running || isSummaryLoading || !canRun}
                    className="flex items-center gap-2 bg-primary px-4 py-2 font-mono text-[11px] text-white uppercase hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    {running && (
                        <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {running
                        ? `ANALYZING... (${selectedSymbols.length})`
                        : `RUN_ANALYSIS (${selectedSymbols.length})`}
                </button>
            </header>

            <DashboardPipelineResult
                running={running}
                pipelineResult={pipelineResult}
                allSkipped={allSkipped}
                elapsedSeconds={elapsedSeconds}
            />

            {summaryError && (
                <div className="mb-4 flex flex-wrap items-center gap-3 border border-outline px-4 py-3 font-mono text-[11px] text-error">
                    <span className="flex-1">[ERROR] {summaryError}</span>
                    <button
                        type="button"
                        onClick={() => reload()}
                        className="shrink-0 border border-outline px-3 py-1 font-mono text-[11px] uppercase hover:bg-surface-container"
                    >
                        RETRY
                    </button>
                </div>
            )}

            <DashboardWatchlistSection
                items={items}
                isWatchlistLoading={isWatchlistLoading}
                watchlistError={watchlistError}
                selectedSymbols={selectedSymbols}
                allSelected={allSelected}
                selectedCount={selectedCount}
                running={running}
                onSelectAll={handleSelectAll}
                onSelectSymbol={handleSelectSymbol}
            />

            <DashboardSummarySection
                summaries={summaries}
                reportSummaries={reportSummaries}
                isSummaryLoading={isSummaryLoading}
                running={running}
                watchlistCount={items.length}
                progressEvents={progressEvents}
                heatmapBySymbol={heatmapBySymbol}
                heatmapWeeks={heatmapData?.weeks ?? 6}
                isLoggedIn={isLoggedIn}
            />

            <DashboardAnalysisLogsSection
                analysisLogs={analysisLogsForDisplay}
                totalLogsFromApi={analysisLogs.length}
                isSummaryLoading={isSummaryLoading}
                heatmapBySymbol={heatmapBySymbol}
                heatmapWeeks={heatmapData?.weeks ?? 6}
            />
        </main>
    )
}
