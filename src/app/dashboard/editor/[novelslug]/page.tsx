import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { NovelWorkspaceRoute } from "@/components/dashboard/editor/novel-workspace-route"

interface PageProps {
  params: Promise<{
    novelslug: string
  }>
}

export default async function NovelPage({ params }: PageProps) {
  const { novelslug } = await params

  return (
    <DashboardLayout>
      <NovelWorkspaceRoute novelSlug={novelslug} />
    </DashboardLayout>
  )
}
