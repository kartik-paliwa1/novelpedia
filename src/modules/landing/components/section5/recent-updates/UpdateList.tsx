import { recentlyUpdatedNovels } from '@/modules/landing/components/section5/recent-updates/recentlyUpdated';
import UpdateCard from '@/modules/landing/components/section5/recent-updates/UpdateCard';

export default function UpdateList() {
  return (
    <div className="divide-y divide-gray-700/30">
      {recentlyUpdatedNovels.map((novel) => (
        <UpdateCard key={novel.id} novel={novel} />
      ))}
    </div>
  );
}
