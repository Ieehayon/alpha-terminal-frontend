"use client"

import { useMemo, useState } from "react"
import { ClientPaginationBar } from "@/app/components/ClientPaginationBar"
import { DailyReturnsHeatmapLegend } from "@/app/components/DailyReturnsHeatmapLegend"
import { StockDailyReturnsHeatmap } from "@/app/components/StockDailyReturnsHeatmap"
import type { AnalysisLog } from "@/features/dashboard/domain/model/stockSummary"
import type { HeatmapItem } from "@/features/stock/domain/model/dailyReturnsHeatmap"
import { useClientPagination } from "@/features/shared/application/hooks/useClientPagination"
import { SENTIMENT_BADGE, formatAnalyzedAt } from "./dashboardBadges"

const SOURCE_LABEL: Record<string, string> = {
    NEWS: '뉴스',
    DISCLOSURE: '공시',
    REPORT: '재무',
}
const SOURCE_STYLE: Record<string, string> = {
    NEWS: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
    DISCLOSURE: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
    REPORT: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
}

type Props = {
    analysisLogs: AnalysisLog[]
    /** API에서 받은 원본 로그 개수(요약과 중복 숨김으로 목록이 비었을 때 안내) */
    totalLogsFromApi?: number
    isSummaryLoading: boolean
    heatmapBySymbol?: Record<string, HeatmapItem>
    heatmapWeeks?: number
}

export function DashboardAnalysisLogsSection({
    analysisLogs,
    totalLogsFromApi,
    isSummaryLoading,
    heatmapBySymbol,
    heatmapWeeks = 6,
}: Props) {
    const rawCount = totalLogsFromApi ?? analysisLogs.length
    const deferredAllAsCurrent = !isSummaryLoading && analysisLogs.length === 0 && rawCount > 0
    const [logsExpanded, setLogsExpanded] = useState(true)

    const showHeatmapLegend = useMemo(
        () => analysisLogs.some((l) => !!heatmapBySymbol?.[l.symbol.trim().toUpperCase()]),
        [analysisLogs, heatmapBySymbol],
    )

    const {
        page: logPage,
        totalPages: logTotalPages,
        pageItems: pagedLogs,
        setPage: setLogPage,
        rangeStart: logRangeStart,
        rangeEnd: logRangeEnd,
        totalItems: logTotal,
        showPagination: logsShowPagination,
    } = useClientPagination(analysisLogs)

    return (
        <section className="mb-10" aria-label="최근 AI 분석 로그">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">최근 AI 분석 로그</h2>
                    <p className="text-sm text-gray-500">
                        가장 최근에 생성된 AI 분석 내용부터 확인할 수 있습니다.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {analysisLogs.length > 0 && (
                        <span className="text-xs text-gray-500">{analysisLogs.length}개 로그</span>
                    )}
                    {analysisLogs.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setLogsExpanded((v) => !v)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                            aria-expanded={logsExpanded}
                            aria-controls="dashboard-analysis-log-list"
                        >
                            {logsExpanded ? "로그 접기" : "로그 펼치기"}
                        </button>
                    )}
                </div>
            </div>

            {isSummaryLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                    ))}
                </div>
            ) : deferredAllAsCurrent ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-600">
                    <p className="mb-2 text-gray-500">
                        방금 분석한 내용은 위 <strong className="font-medium text-gray-600 dark:text-gray-400">AI 분석 요약</strong>
                        에만 표시됩니다.
                    </p>
                    <p className="text-sm text-gray-500">
                        같은 종목에 새 분석이 실행되면, 이전 결과가 여기 로그에 쌓입니다.
                    </p>
                </div>
            ) : analysisLogs.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-600">
                    <p className="mb-2 text-gray-500">아직 누적된 분석 로그가 없습니다.</p>
                    <p className="text-sm text-gray-500">
                        분석을 실행하려면 화면 상단의 &quot;선택 종목 분석&quot; 버튼을 사용하세요.
                    </p>
                </div>
            ) : logsExpanded ? (
                <div id="dashboard-analysis-log-list" className="space-y-3">
                    {showHeatmapLegend ? (
                        <DailyReturnsHeatmapLegend className="rounded-lg border border-gray-200 bg-gray-50/80 px-3 py-2 dark:border-gray-600 dark:bg-gray-900/40" />
                    ) : null}
                    {pagedLogs.map((log, index) => {
                        const sentimentClass = SENTIMENT_BADGE[log.sentiment] ?? SENTIMENT_BADGE.NEUTRAL
                        const hi = heatmapBySymbol?.[log.symbol.trim().toUpperCase()]
                        return (
                            <article
                                key={`${log.symbol}-${log.analyzed_at}-${index}`}
                                className="rounded-lg border border-gray-200 bg-white/60 px-4 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/40"
                            >
                                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="font-mono text-sm font-semibold text-gray-600 dark:text-gray-300">
                                            {log.symbol}
                                        </span>
                                        <span className="text-sm font-medium">{log.name}</span>
                                        {log.source_type && SOURCE_LABEL[log.source_type] && (
                                            <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${SOURCE_STYLE[log.source_type]}`}>
                                                {SOURCE_LABEL[log.source_type]}
                                            </span>
                                        )}
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sentimentClass}`}>
                                            {log.sentiment}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">{formatAnalyzedAt(log.analyzed_at)}</div>
                                </div>

                                <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">{log.summary}</p>

                                {hi ? (
                                    <div className="mb-3">
                                        <StockDailyReturnsHeatmap
                                            item={hi}
                                            weeks={heatmapWeeks}
                                            showLegend={false}
                                            sentimentScore={log.sentiment_score}
                                        />
                                    </div>
                                ) : null}

                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                    {log.tags.map((tag) => (
                                        <span
                                            key={`${log.symbol}-${log.analyzed_at}-${tag}`}
                                            className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                    <span className="text-gray-500">신뢰도 {(log.confidence * 100).toFixed(0)}%</span>
                                    <span className="text-gray-500">감성 점수 {log.sentiment_score.toFixed(2)}</span>
                                </div>
                            </article>
                        )
                    })}
                    {logsShowPagination ? (
                        <ClientPaginationBar
                            page={logPage}
                            totalPages={logTotalPages}
                            onPageChange={setLogPage}
                            rangeStart={logRangeStart}
                            rangeEnd={logRangeEnd}
                            totalItems={logTotal}
                        />
                    ) : null}
                </div>
            ) : (
                <p id="dashboard-analysis-log-list" className="text-sm text-gray-500">
                    로그 목록을 접었습니다. 위의 &quot;로그 펼치기&quot;로 다시 볼 수 있습니다.
                </p>
            )}
        </section>
    )
}
