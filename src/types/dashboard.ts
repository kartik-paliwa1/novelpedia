export interface MetricSummary {
  value: number
  change: number
  description: string
}

export interface RatingSummary {
  averageRating: number
  totalReviews: number
  distribution: Record<string, number>
}

export interface DashboardStats {
  performance: {
    totalViews: MetricSummary
    engagementRate: MetricSummary
    chapterCompletion: MetricSummary
    estimatedRevenue: MetricSummary
  }
  ratings: RatingSummary
}
