"use client"

import Link from "next/link"
import { useHome } from "@/features/home/application/hooks/useHome"
import { HomeAlphaTopPicks } from "@/app/components/HomeAlphaTopPicks"
import { HomeSentimentGauge } from "@/app/components/HomeSentimentGauge"

function Skeleton() {
    return (
        <div className="space-y-4">
            <div className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
            <div className="h-36 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
        </div>
    )
}

export default function Home() {
    const state = useHome()

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                    Alpha Desk
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    AI 기반 주식 분석 워크스테이션
                </p>
            </div>

            {state.status === "LOADING" && <Skeleton />}

            {state.status === "UNAUTHENTICATED" && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-600">
                    <p className="mb-4 text-gray-500">
                        AI 분석 현황을 보려면 로그인이 필요합니다.
                    </p>
                    <Link
                        href="/login"
                        className="rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        로그인
                    </Link>
                </div>
            )}

            {state.status === "EMPTY" && (
                <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center dark:border-gray-600">
                    <p className="mb-2 text-gray-500">아직 AI 분석 데이터가 없습니다.</p>
                    <p className="text-sm text-gray-400">
                        대시보드에서 관심종목 분석을 실행해 보세요.
                    </p>
                    <Link
                        href="/dashboard"
                        className="mt-4 inline-block rounded-full bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                    >
                        대시보드로 이동
                    </Link>
                </div>
            )}

            {state.status === "ERROR" && (
                <div className="rounded-xl border border-dashed border-red-200 px-6 py-10 text-center dark:border-red-800">
                    <p className="text-sm text-red-500">{state.message}</p>
                </div>
            )}

            {state.status === "READY" && (
                <div className="space-y-4">
                    <HomeSentimentGauge
                        gauge={state.stats.gauge}
                        distribution={state.stats.distribution}
                    />
                    <HomeAlphaTopPicks topPicks={state.stats.topPicks} />
                </div>
            )}

            {(state.status === "READY" || state.status === "EMPTY") && (
                <div className="mt-6 flex gap-3">
                    <Link
                        href="/dashboard"
                        className="flex-1 rounded-full border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        대시보드
                    </Link>
                    <Link
                        href="/watchlist"
                        className="flex-1 rounded-full border border-gray-300 py-2 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                        관심종목
                    </Link>
                </div>
            )}
        </main>
    )
}
