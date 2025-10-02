"use client"

import { WelcomeSection } from '@/modules/dashboard/components/dashboard/welcome-section'
import { NovelOverview } from '@/modules/dashboard/components/dashboard/novel-overview'
import { StatsGrid } from '@/modules/dashboard/components/dashboard/stats-grid'
import { ReaderActivity } from '@/modules/dashboard/components/dashboard/reader-activity'
import { NotificationsSection } from '@/modules/dashboard/components/dashboard/notifications-section'
import { PromotionSection } from '@/modules/dashboard/components/dashboard/promotion-section'

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
