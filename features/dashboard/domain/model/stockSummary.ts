export type Sentiment = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'

export interface PipelineProcessed {
    symbol: string
    skipped: boolean
    reason?: string
}

export interface PipelineResult {
    message: string
    processed: PipelineProcessed[]
}

export type Tag = string | { label: string; category?: string }

export interface StockSummary {
    symbol: string
    name: string
    summary: string
    tags: Tag[]
    sentiment: Sentiment
    sentiment_score: number
    confidence: number
}

export interface AnalysisLog {
    analyzed_at: string
    symbol: string
    name: string
    summary: string
    tags: string[]
    sentiment: Sentiment
    sentiment_score: number
    confidence: number
}
