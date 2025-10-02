import { Edit3 } from "lucide-react";
import { Button } from "@/common/components/ui/button";
import PersonalDetailsForm from '@/modules/profile/components/private/PersonalDetailsForm';

// Props for the Personal Info Tab
interface PersonalInfoTabProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  personalInfo: {
    birthday: string;
    gender: string;
    location: string;
    favouriteNovel: string; // Use camelCase across components
    bio: string;
  };
}

export default function PersonalInfoTab({
  isEditing,
  onToggleEdit,
  personalInfo,
}: PersonalInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Card container */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            🧾 Personal Information
          </h3>
          <Button
            variant="outline"
            size="sm"
            className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white rounded-xl text-sm"
            onClick={onToggleEdit}
          >
            <Edit3 className="w-4 h-4 mr-2" />
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>

        {/* View or Edit Form */}
        <PersonalDetailsForm isEditing={isEditing} personalInfo={personalInfo} />
      </div>
    </div>
  );
}
