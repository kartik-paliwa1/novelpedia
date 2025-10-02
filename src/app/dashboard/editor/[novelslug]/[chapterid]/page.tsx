import { ChapterEditorRoute } from "@/components/dashboard/editor/chapter-editor-route"

interface PageProps {
  params: Promise<{
    novelslug: string
    chapterid: string
  }>
}

export default async function ChapterPage({ params }: PageProps) {
  const { novelslug, chapterid } = await params

  return <ChapterEditorRoute novelSlug={novelslug} chapterId={chapterid} />
}
