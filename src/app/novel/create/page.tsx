import { Suspense } from "react";
import { NovelSetupWizard } from "../_components/novel-setup-wizard";

export default function CreateNovelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#120b2a]" />}>
      <NovelSetupWizard initialMode="create" />
    </Suspense>
  );
}