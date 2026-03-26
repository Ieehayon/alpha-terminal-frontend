'use client'

import type { HeatmapItem } from '@/features/stock/domain/model/dailyReturnsHeatmap'
import { ShareActionBar } from '@/features/share/ui/components/ShareActionBar'
import type { ShareCardPayload } from '@/features/share/domain/model/sharedCard'
import { StockDailyReturnsHeatmap } from './StockDailyReturnsHeatmap'

type Tag = string | { label: string; category?: string }

interface StockSummaryCardProps {
  symbol: string;
  name: string;
  summary: string;
  tags: Tag[];
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentiment_score?: number;
  confidence?: number;
  source_type?: 'NEWS' | 'DISCLOSURE' | 'REPORT';
  url?: string;
  /** BL-FE-30/34: 일별 등락 히트맵(선택). asOf 생략 시 종목 시리즈 마지막 거래일 사용 */
  heatmap?: { item: HeatmapItem; weeks: number; asOf?: string | null };
  /** BL-FE-43: 공유 기능. analyzed_at 제공 시 액션 바 표시 */
  analyzed_at?: string;
  isLoggedIn?: boolean;
}

const SOURCE_LABEL: Record<string, string> = {
  NEWS: '뉴스',
  DISCLOSURE: '공시',
  REPORT: '재무',
}

const SOURCE_STYLE: Record<string, string> = {
  NEWS: 'bg-sky-50 text-sky-600 dark:bg-sky-950 dark:text-sky-400',
  DISCLOSURE: 'bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-400',
  REPORT: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400',
}

function tagLabel(tag: Tag): string {
  if (typeof tag === 'string') return tag
  return tag.label
}

const SENTIMENT_STYLE = {
  POSITIVE: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300',
  NEGATIVE: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300',
  NEUTRAL:  'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
};

const SENTIMENT_LABEL = {
  POSITIVE: '긍정',
  NEGATIVE: '부정',
  NEUTRAL:  '중립',
};

export default function StockSummaryCard({
  symbol, name, summary, tags,
  sentiment, sentiment_score, confidence,
  source_type = 'NEWS',
  url,
  heatmap,
  analyzed_at,
  isLoggedIn = false,
}: StockSummaryCardProps) {
  const wrapperClass =
    'border border-gray-200 dark:border-gray-700 rounded-xl bg-background flex flex-col' +
    (url ? ' hover:border-blue-400 hover:shadow-md transition-all' : '');

  // url이 있을 때 링크로 연결될 내용부 (액션 바 제외)
  const linkableContent = (
    <>
      {/* 종목명 + 출처 배지 + 감성 배지 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg font-bold text-foreground">{symbol}</span>
          <span className="text-sm text-gray-500">{name}</span>
          {source_type && SOURCE_LABEL[source_type] && (
            <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${SOURCE_STYLE[source_type]}`}>
              {SOURCE_LABEL[source_type]}
            </span>
          )}
        </div>
        {sentiment && (
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${SENTIMENT_STYLE[sentiment]}`}>
            {SENTIMENT_LABEL[sentiment]}{' '}
            {sentiment_score !== undefined
              ? `${sentiment_score > 0 ? '+' : ''}${sentiment_score.toFixed(2)}`
              : ''}
          </span>
        )}
      </div>

      {/* 요약 텍스트 */}
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{summary}</p>

      {heatmap && (
        <StockDailyReturnsHeatmap
          item={heatmap.item}
          weeks={heatmap.weeks}
          asOf={heatmap.asOf ?? null}
          showLegend={false}
          sentimentScore={sentiment_score}
        />
      )}

      {/* 태그 */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, i) => (
          <span
            key={`${tagLabel(tag)}-${i}`}
            className="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full dark:bg-blue-950 dark:text-blue-300"
          >
            {tagLabel(tag)}
          </span>
        ))}
      </div>

      {/* 신뢰도 바 */}
      {confidence !== undefined && (
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-400">신뢰도</span>
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-400 rounded-full"
              style={{ width: `${confidence * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-400">{Math.round(confidence * 100)}%</span>
        </div>
      )}

      {/* 원문 링크 힌트 */}
      {url && (
        <span className="text-xs text-blue-400 mt-1">원문 보기 →</span>
      )}
    </>
  );

  // 액션 바는 항상 링크 바깥에 위치 (클릭 시 원문 링크로 이동하지 않음)
  const actionBar = analyzed_at ? (
    <div className="px-5 pb-4">
      <ShareActionBar
        sharePayload={{
          symbol,
          name,
          summary,
          tags: tags.map(tagLabel),
          sentiment: sentiment ?? 'NEUTRAL',
          sentiment_score: sentiment_score ?? 0,
          confidence: confidence ?? 0,
          source_type,
          url,
          analyzed_at,
        } satisfies ShareCardPayload}
        isLoggedIn={isLoggedIn}
      />
    </div>
  ) : null;

  return (
    <div className={wrapperClass}>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col gap-3 p-5 cursor-pointer"
        >
          {linkableContent}
        </a>
      ) : (
        <div className="flex flex-col gap-3 p-5">
          {linkableContent}
        </div>
      )}
      {actionBar}
    </div>
  );
}
