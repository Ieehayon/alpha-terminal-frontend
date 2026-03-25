'use client'

import { useState } from 'react'
import { useWatchlist } from '@/features/watchlist/application/hooks/useWatchlist'
import { useStockSearch } from '@/features/stock/application/hooks/useStockSearch'
import type { StockItem } from '@/features/stock/domain/model/stockItem'

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

export default function WatchlistPage() {
    const { items, isLoading, error, add, remove } = useWatchlist()
    const { results, isLoading: isSearching, error: searchError, query, search, clear } = useStockSearch()
    const [registering, setRegistering] = useState<string | null>(null)

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        search(e.target.value)
    }

    const handleRegister = async (item: StockItem) => {
        setRegistering(item.symbol)
        const ok = await add(item.symbol, item.name, item.market)
        setRegistering(null)
        if (ok) clear()
    }

    return (
        <main className="min-h-screen bg-background text-foreground p-8 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">관심종목</h1>

            {/* 검색 UI */}
            <section className="mb-8">
                <h2 className="text-base font-semibold mb-2 text-gray-700 dark:text-gray-300">종목 검색</h2>
                <div className="relative">
                    <div className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white dark:bg-gray-900 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500">
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearch}
                            placeholder="종목명 또는 코드로 검색 (예: 삼성전자, 005930)"
                            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder-gray-400"
                        />
                        {isSearching && (
                            <span className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin shrink-0" />
                        )}
                    </div>

                    {searchError && (
                        <p className="mt-2 text-sm text-red-500">{searchError}</p>
                    )}

                    {query.length > 0 && !isSearching && results.length === 0 && !searchError && (
                        <p className="mt-2 text-sm text-gray-500">검색 결과가 없습니다.</p>
                    )}

                    {/* 검색 드롭다운 */}
                    {results.length > 0 && (
                        <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                            {results.map((item) => (
                                <li key={item.symbol}>
                                    <button
                                        type="button"
                                        onClick={() => handleRegister(item)}
                                        disabled={registering === item.symbol}
                                        className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950 text-left transition-colors disabled:opacity-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-xs text-gray-400 w-14">{item.symbol}</span>
                                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
                                            <MarketBadge market={item.market} />
                                        </div>
                                        <span className="text-xs text-blue-500 shrink-0">
                                            {registering === item.symbol ? '등록 중...' : '+ 추가'}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <p className="mt-1.5 text-xs text-gray-400">검색 결과를 클릭하면 바로 관심종목에 추가됩니다.</p>
            </section>

            {error && (
                <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg dark:bg-red-950 dark:border-red-700 dark:text-red-300">
                    {error}
                </div>
            )}

            {/* 관심종목 목록 */}
            <section>
                <h2 className="text-base font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    등록된 관심종목
                    <span className="ml-2 text-sm font-normal text-gray-400">({items.length})</span>
                </h2>

                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-gray-400 py-10 text-center border border-dashed border-gray-300 rounded-lg dark:border-gray-700 text-sm">
                        관심종목을 검색해서 추가해보세요.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-xs text-gray-400 w-14">{item.symbol}</span>
                                    <span className="font-medium text-sm">{item.name}</span>
                                    <MarketBadge market={item.market} />
                                </div>
                                <button
                                    onClick={() => remove(item.id)}
                                    className="px-3 py-1 text-xs text-red-500 border border-red-200 rounded hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                                >
                                    삭제
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    )
}
