import React from "react";

interface ReadingGoalProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  gradient: string; // Tailwind class e.g., "from-violet-500 to-fuchsia-500"
}

export default function ReadingGoalsProgress({
  label,
  current,
  target,
  unit,
  gradient,
}: ReadingGoalProps) {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <div className="bg-gray-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-300 text-sm">{label}</span>
        <span className="text-white font-semibold text-sm">
          {current}/{target}
        </span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 bg-gradient-to-r ${gradient}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <span className="text-gray-400 text-xs">{unit}</span>
    </div>
  );
}
