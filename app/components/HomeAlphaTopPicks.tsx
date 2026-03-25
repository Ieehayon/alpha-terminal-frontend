import type { TopPick } from "@/features/home/domain/model/homeStats"

type Props = {
    topPicks: TopPick[]
}

export function HomeAlphaTopPicks({ topPicks }: Props) {
    if (topPicks.length === 0) return null

    return (
        <div className="rounded-xl border border-gray-200 bg-white/70 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
            <div className="mb-3 flex items-center gap-1.5">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    ⚡ 오늘의 알파 기회
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    score × 신뢰도 상위 3종목
                </span>
            </div>

            <div className="space-y-2">
                {topPicks.map((pick) => (
                    <div
                        key={pick.symbol}
                        className="flex items-center justify-between gap-2 rounded-lg bg-gray-50/80 px-3 py-2 dark:bg-gray-800/60"
                    >
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="shrink-0 font-mono text-sm font-semibold text-gray-600 dark:text-gray-300">
                                {pick.symbol}
                            </span>
                            <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                                {pick.name}
                            </span>
                        </div>
                        <div className="flex shrink-0 items-center gap-2 text-xs">
                            <span className="rounded-full bg-green-50 px-2 py-0.5 font-semibold text-green-700 dark:bg-green-950 dark:text-green-300">
                                AI↑
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                score {pick.sentiment_score.toFixed(2)}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500">
                                신뢰 {(pick.confidence * 100).toFixed(0)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <p className="mt-2 text-[10px] leading-snug text-gray-400 dark:text-gray-500">
                * 투자 권유 아님. AI 분석 참고용 정보입니다.
            </p>
        </div>
    )
}
