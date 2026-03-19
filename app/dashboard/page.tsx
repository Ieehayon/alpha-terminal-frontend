'use client';

import { useEffect, useState } from 'react';
import StockSummaryCard from '../components/StockSummaryCard';
import { MOCK_SUMMARIES } from '../mocks/summaryMocks';
import { summaryApi, StockSummaryItem } from '@/infrastructure/api/summaryApi';

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<StockSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSummaries = () => {
    setLoading(true);
    summaryApi
      .getSummaries()
      .then((data) => setSummaries(data.length > 0 ? data : MOCK_SUMMARIES))
      .catch(() => setSummaries(MOCK_SUMMARIES))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSummaries();
  }, []);

  const handleRunPipeline = async () => {
    setRunning(true);
    setError(null);
    try {
      await summaryApi.runPipeline();
      fetchSummaries();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setRunning(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-10">

      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">대시보드</h1>
          <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
        </div>
        <button
          onClick={handleRunPipeline}
          disabled={running}
          className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 transition-colors flex items-center gap-2"
        >
          {running && (
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {running ? 'AI 분석 중... (30초~1분 소요)' : '최신 분석 실행'}
        </button>
      </header>

      {running && (
        <div className="mb-4 px-4 py-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg dark:bg-blue-950 dark:border-blue-700 dark:text-blue-300">
          AI가 관심종목 뉴스를 수집하고 분석 중입니다. 잠시만 기다려주세요...
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <section>
        {loading ? (
          <p className="text-gray-500 py-8 text-center">불러오는 중...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {summaries.map((stock) => (
              <StockSummaryCard
                key={stock.symbol}
                symbol={stock.symbol}
                name={stock.name}
                summary={stock.summary}
                tags={stock.tags}
                sentiment={stock.sentiment}
                sentiment_score={stock.sentiment_score}
                confidence={stock.confidence}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
