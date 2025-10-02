import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { ChapterEditorRoute } from "@/components/dashboard/editor/chapter-editor-route"

interface PageProps {
  params: Promise<{
    novelslug: string
    chapterid: string
  }>
}

export default async function ChapterPage({ params }: PageProps) {
  const resolvedParams = await params
  
  return (
    <DashboardLayout>
      <ChapterEditorRoute novelSlug={resolvedParams.novelslug} chapterId={resolvedParams.chapterid} />
    </DashboardLayout>
  )
}
