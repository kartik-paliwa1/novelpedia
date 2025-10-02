import { Suspense } from "react"
import { NovelSetupWizard } from "../../_components/novel-setup-wizard"

interface EditNovelPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function EditNovelPage({ params }: EditNovelPageProps) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#120b2a]" />}>
      <NovelSetupWizard initialMode="edit" prefillSlug={decodedSlug} />
    </Suspense>
  )
}
