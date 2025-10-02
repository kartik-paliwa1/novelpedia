import { DashboardLayout } from "@/components/dashboard/layout/dashboard-layout"
import { EditorNovelList } from "@/components/dashboard/editor/editor-novel-list"

export default function WorkspacePage() {
  return (
    <DashboardLayout>
      <EditorNovelList />
    </DashboardLayout>
  )
}