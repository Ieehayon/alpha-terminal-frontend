type Tag = string | { label: string; category?: string }

interface StockSummaryCardProps {
  symbol: string;
  name: string;
  summary: string;
  tags: Tag[];
  sentiment?: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  sentiment_score?: number;
  confidence?: number;
  url?: string;
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
  symbol,
  name,
  summary,
  tags,
  sentiment,
  sentiment_score,
  confidence,
  url,
}: StockSummaryCardProps) {
  const cardClass =
    'border border-gray-200 dark:border-gray-700 rounded-xl p-5 flex flex-col gap-3 bg-background' +
    (url ? ' cursor-pointer hover:border-blue-400 hover:shadow-md transition-all' : '');

  const inner = (
    <>
      {/* 종목명 + 감성 배지 */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">{symbol}</span>
          <span className="text-sm text-gray-500">{name}</span>
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

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {inner}
      </a>
    );
  }

  return <div className={cardClass}>{inner}</div>;
}
