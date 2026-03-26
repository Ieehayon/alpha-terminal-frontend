import type { TodayBriefing, BriefingStock } from "@/features/home/domain/model/todayBriefing"

function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Seoul",
    })
}

function truncate(text: string, max = 55): string {
    return text.length <= max ? text : `${text.slice(0, max)}…`
}

const SOURCE_LABEL: Record<string, string> = {
    NEWS: "뉴스",
    DISCLOSURE: "공시",
    REPORT: "재무",
}

const SOURCE_STYLE: Record<string, string> = {
    NEWS: "bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400",
    DISCLOSURE: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400",
    REPORT: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400",
}

function StockRow({ stock, type }: { stock: BriefingStock; type: "positive" | "negative" }) {
    const scoreColor =
        type === "positive"
            ? "text-green-700 dark:text-green-300"
            : "text-blue-700 dark:text-blue-300"
    const badge =
        type === "positive"
            ? "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
            : "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
    const arrow = type === "positive" ? "AI↑" : "AI↓"
    const sourceLabel = stock.source_type ? SOURCE_LABEL[stock.source_type] : null
    const sourceStyle = stock.source_type ? SOURCE_STYLE[stock.source_type] : ""

    return (
        <div className="flex flex-col gap-0.5 rounded-lg bg-gray-50/80 px-3 py-2.5 dark:bg-gray-800/60">
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="shrink-0 font-mono text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {stock.symbol}
                    </span>
                    <span className="truncate text-sm text-gray-500 dark:text-gray-400">
                        {stock.name}
                    </span>
                    {sourceLabel && (
                        <span className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium ${sourceStyle}`}>
                            {sourceLabel}
                        </span>
                    )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5 text-xs">
                    <span className={`rounded-full px-2 py-0.5 font-semibold ${badge}`}>
                        {arrow}
                    </span>
                    <span className={`font-medium ${scoreColor}`}>
                        {stock.sentiment_score > 0 ? "+" : ""}
                        {stock.sentiment_score.toFixed(2)}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">
                        신뢰 {Math.round(stock.confidence * 100)}%
                    </span>
                </div>
            </div>
            {stock.summary && (
                <p className="text-xs leading-relaxed text-gray-400 dark:text-gray-500 pl-0.5">
                    {truncate(stock.summary)}
                </p>
            )}
        </div>
    )
}

type Props = {
    briefing: TodayBriefing
}

export function HomeTodayBriefing({ briefing }: Props) {
    const showPositive = briefing.positive.slice(0, 3)
    const showNegative = briefing.negative.slice(0, 2)

    return (
        <div className="rounded-xl border border-gray-200 bg-white/70 px-5 py-4 shadow-sm dark:border-gray-700 dark:bg-gray-900/50">
            {/* 헤더 */}
            <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    📋 오늘의 브리핑
                </span>
                <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    {briefing.dateLabel}
                    {briefing.lastAnalyzedAt && (
                        <> · {formatTime(briefing.lastAnalyzedAt)} 분석</>
                    )}
                </span>
            </div>

            {/* 데이터 없음 */}
            {briefing.isEmpty ? (
                <div className="py-4 text-center">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                        아직 오늘의 분석 데이터가 없습니다.
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-600">
                        매일 07:00 KST 자동 수집됩니다.
                    </p>
                </div>
            ) : (
                <>
                    {/* 분석 요약 바 */}
                    <div className="mb-3 flex flex-wrap gap-x-3 gap-y-0.5 text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                            분석 <strong className="text-gray-700 dark:text-gray-200">{briefing.analyzedCount}</strong>종목
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                            긍정 {briefing.positive.length}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            중립 {briefing.neutral.length}
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                            부정 {briefing.negative.length}
                        </span>
                    </div>

                    {/* 주목 종목 */}
                    {showPositive.length > 0 && (
                        <div className="mb-3">
                            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                📈 주목 종목
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {showPositive.map((s) => (
                                    <StockRow key={s.symbol} stock={s} type="positive" />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 리스크 종목 */}
                    {showNegative.length > 0 && (
                        <div>
                            <p className="mb-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                                ⚠️ 리스크 종목
                            </p>
                            <div className="flex flex-col gap-1.5">
                                {showNegative.map((s) => (
                                    <StockRow key={s.symbol} stock={s} type="negative" />
                                ))}
                            </div>
                        </div>
                    )}

                    <p className="mt-3 text-[10px] leading-snug text-gray-400 dark:text-gray-500">
                        * 투자 권유 아님. AI 분석 참고용 정보입니다.
                    </p>
                </>
            )}
        </div>
    )
}
