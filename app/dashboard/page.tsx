import StockSummaryCard from '../components/StockSummaryCard';

const MOCK_STOCKS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    summary: '세계 최대 소비자 가전 및 소프트웨어 기업으로, iPhone, Mac, iPad 등을 제조합니다.',
    tags: ['기술', '소비자가전', 'NASDAQ'],
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    summary: '전기차 및 에너지 저장 솔루션을 설계·제조하는 글로벌 기업입니다.',
    tags: ['전기차', '에너지', 'NASDAQ'],
  },
  {
    symbol: '005930',
    name: '삼성전자',
    summary: '반도체, 스마트폰, 가전제품 등을 생산하는 글로벌 전자 기업입니다.',
    tags: ['반도체', '가전', 'KOSPI'],
  },
];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-10">

      {/* 상단 제목/레이아웃 */}
      <header className="mb-8">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-sm text-gray-500 mt-1">관심종목 요약 정보</p>
      </header>

      {/* 카드 리스트 영역 — 반응형 그리드 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOCK_STOCKS.map((stock) => (
            <StockSummaryCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              summary={stock.summary}
              tags={stock.tags}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
