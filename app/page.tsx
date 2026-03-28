"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/features/auth/application/hooks/useAuth"

const HOW_IT_WORKS = [
    {
        step: "01",
        title: "관심종목 등록",
        desc: "삼성전자, 현대차, NAVER 등 분석하고 싶은 종목을 검색해서 워치리스트에 추가합니다.",
        icon: "playlist_add",
    },
    {
        step: "02",
        title: "AI 자동 수집·분석",
        desc: "매일 07:00 KST, AI가 등록 종목의 뉴스·공시·재무 리포트를 자동 수집하고 요약합니다.",
        icon: "smart_toy",
    },
    {
        step: "03",
        title: "대시보드에서 확인",
        desc: "감성 점수, 리스크 태그, 3~5줄 요약을 대시보드에서 한눈에 확인합니다. 투자 판단은 본인이.",
        icon: "dashboard",
    },
]

const SAMPLE_SUMMARIES = [
    {
        symbol: "005930",
        name: "삼성전자",
        sentiment: "POSITIVE",
        score: "+0.72",
        source: "뉴스",
        tags: ["HBM", "AI서버", "반도체"],
        summary:
            "HBM3E 메모리 공급 계약 잠정 체결 보도. 엔비디아향 물량 증가 기대감. 2분기 실적 상향 모멘텀 확인.",
        confidence: 84,
    },
    {
        symbol: "005380",
        name: "현대차",
        sentiment: "NEUTRAL",
        score: "+0.08",
        source: "공시",
        tags: ["전기차", "IRA", "북미"],
        summary:
            "미국 IRA 세액공제 요건 충족 공시 제출. 현지 생산 비율 조건 통과. 실질 수혜 규모는 추가 확인 필요.",
        confidence: 61,
    },
    {
        symbol: "068270",
        name: "셀트리온",
        sentiment: "NEGATIVE",
        score: "-0.41",
        source: "재무",
        tags: ["바이오시밀러", "유럽", "가격경쟁"],
        summary:
            "유럽 바이오시밀러 시장 경쟁 심화로 평균 판매가격(ASP) 하락 압력. 마진 방어 전략 구체화 필요. 리스크 모니터링 권고.",
        confidence: 77,
    },
]

const FEATURES = [
    {
        icon: "bar_chart",
        title: "대시보드",
        desc: "관심종목 AI 요약을 카드 형태로 한눈에 확인. 파이프라인 직접 실행 가능.",
        href: "/dashboard",
    },
    {
        icon: "visibility",
        title: "워치리스트",
        desc: "종목 검색 후 추가. 일별 등락 히트맵으로 최근 6주 흐름 파악.",
        href: "/watchlist",
    },
    {
        icon: "forum",
        title: "커뮤니티",
        desc: "종목 분석·시황 의견을 팀원·사용자와 공유하는 게시판.",
        href: "/board",
    },
    {
        icon: "play_circle",
        title: "영상 피드",
        desc: "관심종목 관련 유튜브 영상을 자동으로 수집해 탭별로 제공.",
        href: "/youtube",
    },
]

const SENTIMENT_STYLE: Record<string, string> = {
    POSITIVE: "border-tertiary text-tertiary",
    NEUTRAL:  "border-on-surface-variant text-on-surface-variant",
    NEGATIVE: "border-error text-error",
}

const SENTIMENT_LABEL: Record<string, string> = {
    POSITIVE: "긍정",
    NEUTRAL:  "중립",
    NEGATIVE: "부정",
}

export default function LandingPage() {
    const router = useRouter()
    const { state, loadUser } = useAuth()

    useEffect(() => {
        loadUser()
    }, [loadUser])

    useEffect(() => {
        if (state.status === "AUTHENTICATED") {
            router.push("/dashboard")
        }
    }, [state.status, router])

    const isLoggedIn = state.status === "AUTHENTICATED"

    if (state.status === "LOADING" || isLoggedIn) {
        return <div className="h-full bg-background" />
    }

    return (
        <div className="h-full overflow-y-auto bg-[#d1d1d1] font-body text-on-surface">

            {/* Landing Nav */}
            <nav className="sticky top-0 w-full z-50 bg-surface-container border-b-2 border-primary flex justify-between items-center px-6 h-12">
                <span className="font-headline font-bold text-xl text-primary uppercase tracking-tighter">
                    ALPHA_DESK_v1.0
                </span>
                <div className="hidden md:flex gap-6 items-center font-mono uppercase tracking-tighter text-sm">
                    <a href="#how" className="text-on-surface-variant hover:text-primary">HOW_IT_WORKS</a>
                    <a href="#sample" className="text-on-surface-variant hover:text-primary">SAMPLE_OUTPUT</a>
                    <a href="#features" className="text-on-surface-variant hover:text-primary">FEATURES</a>
                </div>
                <div>
                    {isLoggedIn ? (
                        <Link href="/dashboard" className="bg-primary text-white font-mono text-xs px-3 py-1.5 uppercase hover:opacity-90">
                            GO_DASHBOARD →
                        </Link>
                    ) : (
                        <Link href="/login" className="bg-primary text-white font-mono text-xs px-3 py-1.5 uppercase hover:opacity-90">
                            SYS_LOGIN →
                        </Link>
                    )}
                </div>
            </nav>

            {/* Paper Feed */}
            <main className="relative my-8 mx-auto w-full max-w-5xl bg-white flex">
                {/* Left Sprocket */}
                <div className="w-12 sprocket-margin border-r border-outline-variant hidden sm:block flex-shrink-0" />

                <div className="flex-1 bg-white p-6 sm:p-12 min-w-0">

                    {/* ── Hero ── */}
                    <section className="mb-16">
                        <div className="border-4 border-primary p-6 md:p-10 flex flex-col gap-6">
                            <div className="bg-primary text-on-primary px-3 py-1 font-mono text-xs uppercase w-fit">
                                SYSTEM_STATUS: ONLINE
                            </div>

                            <div>
                                <h1 className="font-headline font-bold text-4xl md:text-6xl tracking-tighter text-primary leading-none uppercase mb-4">
                                    관심종목<br />AI 인텔리전스<br />터미널
                                </h1>
                                <p className="font-mono text-sm text-on-surface-variant leading-relaxed max-w-lg">
                                    뉴스·공시·리포트를 매일 자동 수집하고<br />
                                    AI가 3~5줄로 요약 + 감성 점수 + 리스크 태그를 부착합니다.<br />
                                    <span className="text-outline">투자 추천은 하지 않습니다. 판단은 본인이 합니다.</span>
                                </p>
                            </div>

                            <div className="flex gap-3 flex-wrap">
                                {isLoggedIn ? (
                                    <Link href="/dashboard" className="bg-primary text-white font-mono text-sm px-5 py-2.5 uppercase hover:opacity-90">
                                        대시보드 시작 →
                                    </Link>
                                ) : (
                                    <>
                                        <Link href="/login" className="bg-primary text-white font-mono text-sm px-5 py-2.5 uppercase hover:opacity-90">
                                            무료로 시작 →
                                        </Link>
                                        <Link href="/board" className="border border-primary text-primary font-mono text-sm px-5 py-2.5 uppercase hover:bg-primary hover:text-white">
                                            커뮤니티 보기
                                        </Link>
                                    </>
                                )}
                            </div>

                            <div className="border-t border-primary pt-4 grid grid-cols-3 gap-4 font-mono text-xs">
                                <div>
                                    <div className="text-2xl font-bold text-primary">07:00</div>
                                    <div className="text-outline uppercase">KST 자동 수집</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">3~5줄</div>
                                    <div className="text-outline uppercase">AI 요약</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary">100%</div>
                                    <div className="text-outline uppercase">사실 기반</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="micro-perforation my-12" />

                    {/* ── [01] How It Works ── */}
                    <section id="how" className="mb-16">
                        <h2 className="font-headline font-bold text-xl text-primary mb-8 border-b border-primary pb-2 uppercase tracking-widest">
                            [01] HOW_IT_WORKS
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-outline">
                            {HOW_IT_WORKS.map((step, i) => (
                                <div
                                    key={step.step}
                                    className={`p-6 flex flex-col gap-3 ${i < HOW_IT_WORKS.length - 1 ? "border-b md:border-b-0 md:border-r border-outline" : ""}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono text-3xl font-bold text-primary leading-none">{step.step}</span>
                                        <span className="material-symbols-outlined text-primary" style={{ fontSize: "28px" }}>{step.icon}</span>
                                    </div>
                                    <div className="font-headline font-bold text-on-surface uppercase tracking-tight text-base">
                                        {step.title}
                                    </div>
                                    <p className="font-mono text-sm text-on-surface-variant leading-relaxed">
                                        {step.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="micro-perforation my-12" />

                    {/* ── [02] Sample Output ── */}
                    <section id="sample" className="mb-16">
                        <h2 className="font-headline font-bold text-xl text-primary mb-2 border-b border-primary pb-2 uppercase tracking-widest">
                            [02] SAMPLE_OUTPUT
                        </h2>
                        <p className="font-mono text-xs text-outline mb-6 uppercase tracking-widest">
                            * 아래는 실제 AI 요약 결과 예시입니다. 로그인 후 본인의 관심종목 데이터를 확인하세요.
                        </p>

                        <div className="space-y-4">
                            {SAMPLE_SUMMARIES.map((s) => (
                                <div key={s.symbol} className="border border-outline bg-surface-container-low p-5">
                                    {/* Header */}
                                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-mono text-sm font-bold text-outline">{s.symbol}</span>
                                            <span className="font-mono text-base font-bold text-on-surface">{s.name}</span>
                                            <span className="border border-outline font-mono text-xs px-1.5 py-0.5 text-on-surface-variant">
                                                {s.source}
                                            </span>
                                        </div>
                                        <span className={`border font-mono text-xs px-2 py-0.5 font-bold ${SENTIMENT_STYLE[s.sentiment]}`}>
                                            {SENTIMENT_LABEL[s.sentiment]} {s.score}
                                        </span>
                                    </div>

                                    {/* Summary */}
                                    <p className="font-mono text-sm text-on-surface leading-relaxed mb-3">
                                        {s.summary}
                                    </p>

                                    {/* Tags + Confidence */}
                                    <div className="flex items-center gap-3 flex-wrap">
                                        {s.tags.map((tag) => (
                                            <span key={tag} className="border border-outline font-mono text-xs px-2 py-0.5 text-on-surface-variant">
                                                #{tag}
                                            </span>
                                        ))}
                                        <span className="font-mono text-xs text-outline ml-auto">
                                            신뢰도 {s.confidence}%
                                        </span>
                                    </div>

                                    {/* Confidence bar */}
                                    <div className="mt-3 h-1 bg-surface-container-highest">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${s.confidence}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="micro-perforation my-12" />

                    {/* ── [03] Features ── */}
                    <section id="features" className="mb-16">
                        <h2 className="font-headline font-bold text-xl text-primary mb-8 border-b border-primary pb-2 uppercase tracking-widest">
                            [03] SYSTEM_MODULES
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {FEATURES.map((f) => (
                                <Link
                                    key={f.title}
                                    href={isLoggedIn ? f.href : "/login"}
                                    className="border border-outline p-5 bg-surface-container-low hover:border-primary group flex gap-4"
                                >
                                    <span className="material-symbols-outlined text-primary flex-shrink-0 group-hover:scale-110 transition-transform" style={{ fontSize: "32px" }}>
                                        {f.icon}
                                    </span>
                                    <div>
                                        <div className="font-headline font-bold text-on-surface uppercase text-base mb-1">
                                            {f.title}
                                        </div>
                                        <p className="font-mono text-sm text-on-surface-variant leading-relaxed">
                                            {f.desc}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* ── Disclosure Banner ── */}
                    <section className="mt-20 mb-4">
                        <div className="bg-primary text-white p-8 text-center border-4 border-double border-white outline outline-4 outline-primary">
                            <h2 className="font-headline font-extrabold text-3xl md:text-5xl tracking-[0.15em] mb-3">
                                AI 분석 참고용
                            </h2>
                            <p className="font-mono text-sm uppercase opacity-90 leading-relaxed">
                                FOR AI ANALYSIS REFERENCE ONLY.<br />
                                NOT FINANCIAL ADVICE. INVESTMENT DECISIONS ARE SOLELY YOUR RESPONSIBILITY.
                            </p>
                            <div className="mt-6">
                                {isLoggedIn ? (
                                    <Link href="/dashboard" className="bg-white text-primary font-mono text-sm font-bold px-6 py-2.5 uppercase hover:opacity-90 inline-block">
                                        대시보드로 이동 →
                                    </Link>
                                ) : (
                                    <Link href="/login" className="bg-white text-primary font-mono text-sm font-bold px-6 py-2.5 uppercase hover:opacity-90 inline-block">
                                        시작하기 →
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                </div>

                {/* Right Sprocket */}
                <div className="w-12 sprocket-margin border-l border-outline-variant hidden sm:block flex-shrink-0" />
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-dashed border-outline bg-surface py-8 px-4 flex flex-col items-center gap-3">
                <div className="font-mono text-xs uppercase text-outline text-center space-y-2">
                    <div>(C) 2025 ALPHA DESK SYSTEMS. ALL RIGHTS RESERVED.</div>
                    <div className="flex justify-center gap-6">
                        <span className="hover:text-primary cursor-pointer">PRIVACY.SYS</span>
                        <span className="hover:text-primary cursor-pointer">TERMS.EXE</span>
                    </div>
                </div>
                <div className="font-headline font-bold text-primary text-xs tracking-widest">ALPHA_DESK_CORP</div>
            </footer>

        </div>
    )
}
