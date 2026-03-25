'use client'

import { useEffect, useState } from 'react'
import { useDashboard } from '@/features/dashboard/application/hooks/useDashboard'
import { useWatchlist } from '@/features/watchlist/application/hooks/useWatchlist'
import StockSummaryCard from '../components/StockSummaryCard'
import { summaryApi, StockSummaryItem } from '@/infrastructure/api/summaryApi'

const MARKET_BADGE: Record<string, string> = {
    KOSPI:  'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    KOSDAQ: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    NASDAQ: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    NYSE:   'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

const SENTIMENT_BADGE: Record<string, string> = {
    POSITIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    NEGATIVE: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
    NEUTRAL: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
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

function formatAnalyzedAt(value: string) {
    return new Intl.DateTimeFormat('ko-KR', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(value))
}

type Tab = 'news' | 'report';

export default function DashboardPage() {
    const {
        summaries: hookSummaries,
        analysisLogs,
        isLoading: isSummaryLoading,
        error: summaryError,
        pipelineResult,
        executePipeline,
    } = useDashboard()
    const { items, isLoading: isWatchlistLoading, error: watchlistError } = useWatchlist()
    const [running, setRunning] = useState(false)
    const [activeTab, setActiveTab] = useState<Tab>('news')
    const [newsSummaries, setNewsSummaries] = useState<StockSummaryItem[]>([])
    const [reportSummaries, setReportSummaries] = useState<StockSummaryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [doneMessage, setDoneMessage] = useState<string | null>(null)
    const [progressMessages, setProgressMessages] = useState<string[]>([])
    const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
    const [hasInitializedSelection, setHasInitializedSelection] = useState(false)

    useEffect(() => {
        const fetchSummaries = async () => {
            setLoading(true)
            try {
                const [news, reports] = await Promise.all([
                    summaryApi.getSummaries(),
                    summaryApi.getReportSummaries(),
                ])
                setNewsSummaries(news)
                setReportSummaries(reports)
            } catch (e) {
                console.error('[summaries] fetch error:', e)
            } finally {
                setLoading(false)
            }
        }
        fetchSummaries()
    }, [])

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

    const allSkipped = pipelineResult && pipelineResult.processed.every((p) => p.skipped)

    const handleRunPipeline = async () => {
        if (selectedSymbols.length === 0) return
        setRunning(true)
        setError(null)
        setDoneMessage(null)
        setProgressMessages([])

        // 진행 상황 폴링 시작
        const pollInterval = setInterval(async () => {
            try {
                const progress = await summaryApi.getProgress()
                setProgressMessages(progress.messages)
            } catch {
                // ignore polling errors
            }
        }, 1500)

        try {
            await executePipeline(selectedSymbols)
            clearInterval(pollInterval)

            // 완료 후 최종 progress 한 번 더 읽기
            try {
                const finalProgress = await summaryApi.getProgress()
                setProgressMessages(finalProgress.messages)
            } catch {
                // ignore
            }

            const [news, reports] = await Promise.all([
                summaryApi.getSummaries(),
                summaryApi.getReportSummaries(),
            ])
            setNewsSummaries(news)
            setReportSummaries(reports)
            const total = news.length + reports.length
            if (total > 0) {
                setDoneMessage(`분석 완료 — 뉴스 ${news.length}건 · 공시·리포트 ${reports.length}건`)
            } else {
                setDoneMessage('분석이 완료됐지만 결과가 없습니다. 관심종목을 먼저 추가해주세요.')
            }
        } catch (e) {
            clearInterval(pollInterval)
            console.error('[pipeline] error:', e)
            setError((e as Error).message)
        } finally {
            setRunning(false)
        }
    }

    const displayItems = activeTab === 'news' ? newsSummaries : reportSummaries

    return (
        <main className="min-h-screen bg-background text-foreground p-6 md:p-10">
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">대시보드</h1>
                    <p className="text-sm text-gray-500 mt-1">관심종목 AI 요약</p>
                </div>
                <button
                    onClick={handleRunPipeline}
                    disabled={running || isSummaryLoading || selectedSymbols.length === 0}
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

            {running && (
                <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-2">뉴스·공시·재무리포트 수집 및 AI 분석 중...</p>
                    {progressMessages.length > 0 && (
                        <ul className="text-xs space-y-1 max-h-32 overflow-y-auto font-mono">
                            {progressMessages.map((msg, i) => (
                                <li key={i} className={msg.startsWith('✅') ? 'text-green-600 font-semibold' : ''}>
                                    {msg}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {doneMessage && !running && (
                <div className="mb-4 px-4 py-3 bg-green-50 border border-green-300 text-green-700 rounded-lg dark:bg-green-950 dark:border-green-700 dark:text-green-300">
                    {doneMessage}
                </div>
            )}

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                    오류: {error}
                </div>
            )}

            {summaryError && !error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
                    {summaryError}
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

            {/* 관심종목 목록 */}
            <section className="mb-10">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold">
                        관심종목{' '}
                        <span className="text-sm font-normal text-gray-500">({items.length})</span>
                    </h2>

                    {items.length > 0 && (
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allSelected}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                />
                                <span>전체 선택</span>
                            </label>
                            <span>선택 {selectedCount}/{items.length}</span>
                        </div>
                    )}
                </div>

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
                                className={`flex flex-col gap-2 rounded-lg border px-4 py-3 transition-colors ${
                                    selectedSymbols.includes(item.symbol)
                                        ? 'border-blue-500 bg-blue-50/60 dark:border-blue-400 dark:bg-blue-950/30'
                                        : 'border-gray-200 dark:border-gray-700'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedSymbols.includes(item.symbol)}
                                        onChange={(e) => handleSelectSymbol(item.symbol, e.target.checked)}
                                    />
                                    <span className="font-mono text-sm font-semibold text-gray-500">{item.symbol}</span>
                                    <MarketBadge market={item.market} />
                                </div>
                                <span className="font-medium text-sm">{item.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 최근 AI 분석 로그 */}
            <section className="mb-10">
                <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">최근 AI 분석 로그</h2>
                        <p className="text-sm text-gray-500">가장 최근에 생성된 AI 분석 내용부터 확인할 수 있습니다.</p>
                    </div>
                    {analysisLogs.length > 0 && (
                        <span className="text-xs text-gray-500">{analysisLogs.length}개 로그</span>
                    )}
                </div>

                {isSummaryLoading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-28 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : analysisLogs.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 px-6 py-10 text-center dark:border-gray-600">
                        <p className="mb-4 text-gray-500">아직 누적된 분석 로그가 없습니다.</p>
                        <button
                            onClick={handleRunPipeline}
                            disabled={running || selectedSymbols.length === 0}
                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors"
                        >
                            선택 종목 분석
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {analysisLogs.map((log, index) => {
                            const sentimentClass = SENTIMENT_BADGE[log.sentiment] ?? SENTIMENT_BADGE.NEUTRAL
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
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sentimentClass}`}>
                                                {log.sentiment}
                                            </span>
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatAnalyzedAt(log.analyzed_at)}
                                        </div>
                                    </div>

                                    <p className="mb-3 text-sm leading-6 text-gray-700 dark:text-gray-300">
                                        {log.summary}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2 text-xs">
                                        {log.tags.map((tag) => (
                                            <span
                                                key={`${log.symbol}-${log.analyzed_at}-${tag}`}
                                                className="rounded-full bg-blue-50 px-2 py-1 font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                        <span className="text-gray-500">
                                            신뢰도 {(log.confidence * 100).toFixed(0)}%
                                        </span>
                                        <span className="text-gray-500">
                                            감성 점수 {log.sentiment_score.toFixed(2)}
                                        </span>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* 탭 */}
            <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('news')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'news'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    뉴스 분석
                    {newsSummaries.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                            {newsSummaries.length}
                        </span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('report')}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'report'
                            ? 'border-green-600 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    공시·재무리포트
                    {reportSummaries.length > 0 && (
                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                            {reportSummaries.length}
                        </span>
                    )}
                </button>
            </div>

            {/* AI 분석 요약 */}
            <section>
                {loading ? (
                    <p className="text-gray-500 py-8 text-center">불러오는 중...</p>
                ) : displayItems.length === 0 ? (
                    <div className="py-16 text-center text-gray-400">
                        <p className="text-4xl mb-4">
                            {activeTab === 'report' ? '📊' : '📰'}
                        </p>
                        <p className="text-base font-medium text-gray-500">
                            {activeTab === 'report' ? '재무리포트 분석 결과가 없습니다.' : '뉴스 분석 결과가 없습니다.'}
                        </p>
                        <p className="text-sm mt-2 text-gray-400">
                            먼저{' '}
                            <a href="/watchlist" className="text-blue-500 underline">관심종목</a>을 추가한 후
                            &nbsp;&quot;선택 종목 분석&quot; 버튼을 눌러주세요.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {displayItems.map((stock) => {
                            const fallbackUrl = stock.source_type === 'NEWS'
                                ? `https://finance.naver.com/item/news.nhn?code=${stock.symbol}`
                                : `https://dart.fss.or.kr/dsab001/main.do?textCrpNm=${encodeURIComponent(stock.name)}&currentPage=1&maxResults=15&sort=date&series=desc`
                            return (
                                <StockSummaryCard
                                    key={`${stock.symbol}-${stock.source_type}`}
                                    symbol={stock.symbol}
                                    name={stock.name}
                                    summary={stock.summary}
                                    tags={stock.tags}
                                    sentiment={stock.sentiment}
                                    sentiment_score={stock.sentiment_score}
                                    confidence={stock.confidence}
                                    url={stock.url || fallbackUrl}
                                />
                            )
                        })}
                    </div>
                )}
            </section>
        </main>
    )
}
