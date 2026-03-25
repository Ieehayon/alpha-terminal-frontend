"use client"

import { useEffect, useMemo, useState } from "react"
import { useDashboard } from "@/features/dashboard/application/hooks/useDashboard"
import { excludeCurrentSummaryFromLogs } from "@/features/dashboard/domain/excludeCurrentSummaryFromLogs"
import { useWatchlist } from "@/features/watchlist/application/hooks/useWatchlist"
import { DashboardAnalysisLogsSection } from "./components/DashboardAnalysisLogsSection"
import { DashboardPipelineResult } from "./components/DashboardPipelineResult"
import { DashboardSummarySection } from "./components/DashboardSummarySection"
import { DashboardWatchlistSection } from "./components/DashboardWatchlistSection"

export default function DashboardPage() {
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

    return (
        <main
            className="min-h-screen bg-background text-foreground p-6 md:p-10"
            aria-busy={running}
        >
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
                </div>
                <button
                    type="button"
                    onClick={handleRunPipeline}
                    disabled={running || isSummaryLoading || !canRun}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors flex items-center gap-2"
                >
                    {running && (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {running
                        ? `선택 종목 AI 분석 중... (${selectedSymbols.length}개)`
                        : `선택 종목 분석 (${selectedSymbols.length}개)`}
                </button>
            </header>

            <DashboardPipelineResult
                running={running}
                pipelineResult={pipelineResult}
                allSkipped={allSkipped}
                elapsedSeconds={elapsedSeconds}
            />

            {summaryError && (
                <div className="mb-4 flex flex-wrap items-center gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-red-700">
                    <span className="flex-1 text-sm">{summaryError}</span>
                    <button
                        type="button"
                        onClick={() => reload()}
                        className="shrink-0 rounded border border-red-400 px-3 py-1 text-sm font-medium hover:bg-red-100"
                    >
                        다시 시도
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
            />

            <DashboardAnalysisLogsSection
                analysisLogs={analysisLogsForDisplay}
                totalLogsFromApi={analysisLogs.length}
                isSummaryLoading={isSummaryLoading}
            />
        </main>
    )
}
