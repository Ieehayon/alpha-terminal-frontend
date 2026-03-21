'use client'

import { useState } from 'react'
import { useDashboard } from '@/features/dashboard/application/hooks/useDashboard'
import { useWatchlist } from '@/features/watchlist/application/hooks/useWatchlist'
import StockSummaryCard from '../components/StockSummaryCard'

const MARKET_BADGE: Record<string, string> = {
    KOSPI:  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    KOSDAQ: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    NASDAQ: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    NYSE:   'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

function MarketBadge({ market }: { market?: string | null }) {
    if (!market) return null
    const cls = MARKET_BADGE[market] ?? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${cls}`}>
            {market}
        </span>
    )
}

export default function DashboardPage() {
    const { summaries, isLoading: isSummaryLoading, error: summaryError, pipelineResult, executePipeline } = useDashboard()
    const { items, isLoading: isWatchlistLoading, error: watchlistError } = useWatchlist()
    const [running, setRunning] = useState(false)

    const handleRunPipeline = async () => {
        setRunning(true)
        await executePipeline()
        setRunning(false)
    }

    const allSkipped = pipelineResult && pipelineResult.processed.every((p) => p.skipped)

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
                </div>
                <button
                    onClick={handleRunPipeline}
                    disabled={running || isSummaryLoading}
                    className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors flex items-center gap-2"
                >
                    {running && (
                        <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    {running ? 'AI 분석 중... (30초~1분 소요)' : '최신 분석 실행'}
                </button>
            </header>

            {/* 실행 중 안내 */}
            {running && (
                <div className="mb-6 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
                    AI가 관심종목 뉴스를 수집하고 분석 중입니다. 잠시만 기다려주세요...
                </div>
            )}

            {/* 파이프라인 실행 결과 */}
            {!running && pipelineResult && (
                <div className="mb-6 border rounded-lg overflow-hidden dark:border-gray-700">
                    <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">파이프라인 실행 결과</span>
                        {allSkipped ? (
                            <span className="text-xs text-red-500 font-medium">전체 분석 실패</span>
                        ) : (
                            <span className="text-xs text-green-600 font-medium">
                                {pipelineResult.processed.filter((p) => !p.skipped).length}개 성공
                            </span>
                        )}
                    </div>
                    <ul className="divide-y dark:divide-gray-700">
                        {pipelineResult.processed.map((item) => (
                            <li key={item.symbol} className="flex items-center gap-3 px-4 py-2.5">
                                <span className="font-mono text-sm font-semibold w-20 text-gray-600 dark:text-gray-400">
                                    {item.symbol}
                                </span>
                                {item.skipped ? (
                                    <>
                                        <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
                                            스킵
                                        </span>
                                        <span className="text-sm text-gray-500">{item.reason ?? '알 수 없는 오류'}</span>
                                    </>
                                ) : (
                                    <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                                        분석 완료
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                    {allSkipped && (
                        <div className="px-4 py-3 bg-yellow-50 border-t dark:bg-yellow-950 dark:border-gray-700 text-sm text-yellow-700 dark:text-yellow-400">
                            모든 종목의 분석이 실패했습니다. 백엔드 뉴스 수집 또는 AI 서비스 상태를 확인해 주세요.
                        </div>
                    )}
                </div>
            )}

            {summaryError && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                    {summaryError}
                </div>
            )}

            {/* 관심종목 목록 */}
            <section className="mb-10">
                <h2 className="text-lg font-semibold mb-3">
                    관심종목{' '}
                    <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h2>

                {watchlistError && (
                    <p className="mb-2 text-sm text-red-500">{watchlistError}</p>
                )}

                {isWatchlistLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-20 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-gray-500 py-6 text-center border border-dashed border-gray-300 rounded-lg dark:border-gray-600">
                        등록된 관심종목이 없습니다.{' '}
                        <a href="/watchlist" className="text-blue-500 underline hover:text-blue-700">
                            관심종목 등록하기
                        </a>
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col gap-1.5 px-4 py-3 border border-gray-200 rounded-lg dark:border-gray-700"
                            >
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-sm font-semibold text-gray-500">{item.symbol}</span>
                                    <MarketBadge market={item.market} />
                                </div>
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* AI 분석 요약 */}
            <section>
                <h2 className="text-lg font-semibold mb-3">AI 분석 요약</h2>

                {isSummaryLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-40 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : summaries.length === 0 ? (
                    <div className="py-10 text-center border border-dashed border-gray-300 rounded-lg dark:border-gray-600">
                        <p className="text-gray-500 mb-4">아직 분석된 종목이 없습니다.</p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            {items.length === 0 ? (
                                <a
                                    href="/watchlist"
                                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    관심종목 등록하기
                                </a>
                            ) : (
                                <button
                                    onClick={handleRunPipeline}
                                    disabled={running}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    최신 분석 실행
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {summaries.map((stock) => (
                            <StockSummaryCard
                                key={stock.symbol}
                                symbol={stock.symbol}
                                name={stock.name}
                                summary={stock.summary}
                                tags={stock.tags}
                                sentiment={stock.sentiment}
                                sentiment_score={stock.sentiment_score}
                                confidence={stock.confidence}
                            />
                        ))}
                    </div>
                )}
            </section>
        </main>
    )
}
