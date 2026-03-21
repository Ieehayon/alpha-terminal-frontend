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
        <main className="min-h-screen bg-background text-foreground p-8">
            <h1 className="text-2xl font-bold mb-8">관심종목</h1>

            {/* 검색 UI */}
            <section className="mb-8">
                <h2 className="text-lg font-semibold mb-3">종목 검색</h2>
                <div className="relative">
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearch}
                        placeholder="종목 코드(005930) 또는 종목명(삼성전자, Apple)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground dark:border-gray-600"
                    />
                    {isSearching && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            검색 중...
                        </span>
                    )}
                </div>

                {searchError && (
                    <p className="mt-2 text-sm text-red-500">{searchError}</p>
                )}

                {query.length > 0 && !isSearching && results.length === 0 && !searchError && (
                    <p className="mt-2 text-sm text-gray-500">검색 결과가 없습니다.</p>
                )}

                {results.length > 0 && (
                    <ul className="mt-2 border border-gray-200 rounded-lg overflow-hidden dark:border-gray-700">
                        {results.map((item) => (
                            <li
                                key={item.symbol}
                                className="flex items-center justify-between px-4 py-3 border-b border-gray-100 last:border-b-0 dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-semibold text-gray-500">{item.symbol}</span>
                                    <span className="font-medium">{item.name}</span>
                                    <MarketBadge market={item.market} />
                                </div>
                                <button
                                    onClick={() => handleRegister(item)}
                                    disabled={registering === item.symbol}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                    {registering === item.symbol ? '등록 중...' : '등록'}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {error && (
                <p className="mb-4 text-sm text-red-500">{error}</p>
            )}

            {/* 관심종목 목록 */}
            <section>
                <h2 className="text-lg font-semibold mb-3">
                    관심종목 목록{' '}
                    <span className="text-sm font-normal text-gray-500">({items.length})</span>
                </h2>

                {isLoading ? (
                    <div className="flex flex-col gap-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-14 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="text-gray-500 py-8 text-center border border-dashed border-gray-300 rounded-lg dark:border-gray-600">
                        등록된 관심종목이 없습니다. 위에서 종목을 검색하여 등록해 주세요.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-2">
                        {items.map((item) => (
                            <li
                                key={item.id}
                                className="flex items-center justify-between px-4 py-3 border border-gray-200 rounded-lg dark:border-gray-700"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-sm font-semibold text-gray-400">{item.symbol}</span>
                                    <span className="font-medium">{item.name}</span>
                                    <MarketBadge market={item.market} />
                                </div>
                                <button
                                    onClick={() => remove(item.id)}
                                    className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded hover:bg-red-50 active:bg-red-100 transition-colors dark:hover:bg-red-950"
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
