"use client"

import { WelcomeSection } from "@/components/dashboard/dashboard/welcome-section"
import { NovelOverview } from "@/components/dashboard/dashboard/novel-overview"
import { StatsGrid } from "@/components/dashboard/dashboard/stats-grid"
import { ReaderActivity } from "@/components/dashboard/dashboard/reader-activity"
import { NotificationsSection } from "@/components/dashboard/dashboard/notifications-section"
import { PromotionSection } from "@/components/dashboard/dashboard/promotion-section"

export function DashboardContent() {
  return (
    <div className="space-y-8">
      <WelcomeSection />

      <NovelOverview />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <StatsGrid />
        </div>
        <div>
          <NotificationsSection />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ReaderActivity />
        </div>
        <div>
          <PromotionSection />
        </div>
      </div>
    </div>
  )
}
