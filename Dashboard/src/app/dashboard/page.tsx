import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { DashboardContent } from "@/components/dashboard/dashboard/dashboard-content"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </div>
  )
}
