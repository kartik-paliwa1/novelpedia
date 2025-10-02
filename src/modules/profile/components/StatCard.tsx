// Props for a reusable statistics card component
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}
/**
 * Reusable card component for displaying individual statistics
 * Used across various dashboard and profile metrics sections
 */
export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <div className="flex-1 bg-gray-800/50 rounded-xl p-3 text-center">
      <div className="text-lg sm:text-xl font-bold text-white mb-1 flex items-center justify-center gap-1">
        {icon}
        {value}
      </div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  );
}
