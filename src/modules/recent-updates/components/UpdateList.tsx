import { recentlyUpdatedNovels } from '@/modules/recent-updates/components/recentlyUpdated';
import UpdateCard from '@/modules/recent-updates/components/UpdateCard';
import { ensureArray } from '@/utils/safe-array';
import type { UpdateItem } from '@/modules/recent-updates/components/updateTypes';

export default function UpdateList() {
  const novels = ensureArray<UpdateItem>(recentlyUpdatedNovels);
  
  return (
    <div className="divide-y divide-gray-700/30">
      {novels.map((novel) => (
        <UpdateCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}
