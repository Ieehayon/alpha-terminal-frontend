import type { SentimentDistribution, SentimentGauge } from "@/features/home/domain/model/homeStats"

const GAUGE_LABEL_STYLE: Record<string, string> = {
    공포: "text-blue-600 dark:text-blue-400",
    중립: "text-gray-500 dark:text-gray-400",
    탐욕: "text-green-600 dark:text-green-400",
}

type Props = {
    gauge: SentimentGauge
    distribution: SentimentDistribution
}

export function HomeSentimentGauge({ gauge, distribution }: Props) {
    const markerLeft = `${gauge.score}%`

    return (
        <div className="rounded-xl border border-gray-200 bg-white/70 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    내 관심 AI 센티멘트
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    내 관심종목 기반
                </span>
            </div>

            {/* 게이지 바 */}
            <div className="relative mb-1 h-3 w-full overflow-visible rounded-full bg-gradient-to-r from-blue-400 via-gray-300 to-green-400 dark:from-blue-600 dark:via-gray-600 dark:to-green-500">
                <div
                    className="absolute -top-0.5 h-4 w-1 -translate-x-1/2 rounded-full bg-gray-800 shadow dark:bg-white"
                    style={{ left: markerLeft }}
                    aria-hidden
                />
            </div>

            {/* 레이블 */}
            <div className="mb-3 flex justify-between text-[10px] text-gray-400 dark:text-gray-500">
                <span>공포</span>
                <span>중립</span>
                <span>탐욕</span>
            </div>

            {/* 점수 + 레이블 */}
            <div className="mb-3 flex items-baseline gap-2">
                <span className={`text-2xl font-bold ${GAUGE_LABEL_STYLE[gauge.label]}`}>
                    {gauge.score}
                </span>
                <span className={`text-sm font-semibold ${GAUGE_LABEL_STYLE[gauge.label]}`}>
                    {gauge.label}
                </span>
            </div>

            {/* 감성 분포 */}
            {distribution.total > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400">
                        긍정 {distribution.positive}건
                    </span>
                    <span>중립 {distribution.neutral}건</span>
                    <span className="text-blue-600 dark:text-blue-400">
                        부정 {distribution.negative}건
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                        (총 {distribution.total}건 분석)
                    </span>
                </div>
            )}
        </div>
    )
}
