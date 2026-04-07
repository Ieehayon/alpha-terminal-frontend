"use client"

import Link from "next/link"
import { useHome } from "@/features/home/application/hooks/useHome"
import { HomeSentimentGauge } from "@/app/components/HomeSentimentGauge"
import { HomeAlphaTopPicks } from "@/app/components/HomeAlphaTopPicks"
import { HomeTodayBriefing } from "@/app/components/HomeTodayBriefing"

function Skeleton() {
    return (
        <div className="space-y-3">
            <div className="h-36 bg-surface-container animate-pulse" />
            <div className="h-36 bg-surface-container animate-pulse" />
        </div>
    )
}

export default function HomePage() {
    const state = useHome()

    const isPublic = state.status === "PUBLIC_READY"

    return (
        <main className="max-w-5xl mx-auto p-6 pt-8 pb-24 md:p-8 md:pb-8">
            <header className="mb-6 border-b border-outline pb-4">
                <div className="font-headline font-bold text-on-surface text-xl uppercase tracking-tighter">
                    HOME
                </div>
                <div className="font-mono text-sm text-on-surface-variant mt-0.5">
                    {isPublic
                        ? "공개 관심종목 AI 센티먼트 · 로그인하면 내 종목 기준으로 전환됩니다"
                        : "내 관심종목 AI 센티먼트 · 오늘의 알파 기회"}
                </div>
            </header>

            {state.status === "LOADING" && <Skeleton />}

            {state.status === "UNAUTHENTICATED" && (
                <div className="border border-dashed border-outline px-6 py-12 text-center">
                    <p className="font-mono text-sm text-on-surface-variant mb-1">
                        관심종목을 등록하고 AI 센티먼트 분석을 받아보세요.
                    </p>
                    <p className="font-mono text-xs text-outline mb-4">
                        공포/탐욕 게이지 · 알파 기회 종목 · 오늘의 시장 브리핑 제공
                    </p>
                    <Link
                        href="/login"
                        className="font-mono text-xs bg-primary text-white px-5 py-2 uppercase hover:opacity-90 inline-block"
                    >
                        카카오로 시작하기 →
                    </Link>
                </div>
            )}

            {state.status === "EMPTY" && (
                <div className="border border-dashed border-outline px-6 py-12 text-center">
                    <p className="font-mono text-sm text-on-surface-variant mb-1">
                        아직 AI 분석 데이터가 없습니다.
                    </p>
                    <p className="font-mono text-xs text-outline mb-4">
                        대시보드에서 관심종목 분석을 실행해 보세요.
                    </p>
                    <Link
                        href="/dashboard"
                        className="font-mono text-xs border border-outline px-5 py-2 text-on-surface-variant hover:bg-surface-container uppercase inline-block"
                    >
                        대시보드로 이동
                    </Link>
                </div>
            )}

            {state.status === "ERROR" && (
                <div className="border border-dashed border-outline px-6 py-10 text-center">
                    <p className="font-mono text-sm text-error">[ERROR] {state.message}</p>
                </div>
            )}

            {(state.status === "READY" || state.status === "PUBLIC_READY") && (
                <div className="space-y-3">
                    {isPublic && (
                        <div className="flex items-center justify-between border border-outline-variant bg-surface-container px-4 py-2.5">
                            <span className="font-mono text-xs text-on-surface-variant">
                                공개 관심종목 기준 데이터입니다. 로그인하면 내 관심종목으로 전환됩니다.
                            </span>
                            <Link
                                href="/login"
                                className="font-mono text-xs font-bold text-primary uppercase shrink-0 ml-4 hover:opacity-80"
                            >
                                로그인 →
                            </Link>
                        </div>
                    )}
                    <HomeSentimentGauge
                        gauge={state.stats.gauge}
                        distribution={state.stats.distribution}
                    />
                    <HomeAlphaTopPicks topPicks={state.stats.topPicks} />
                    <HomeTodayBriefing briefing={state.briefing} />
                </div>
            )}

        </main>
    )
}
