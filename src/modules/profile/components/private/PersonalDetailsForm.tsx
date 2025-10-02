import { Input } from "@/common/components/ui/input";

interface PersonalDetailsFormProps {
  isEditing: boolean;
  personalInfo: {
    birthday: string;
    gender: string;
    location: string;
    favouriteNovel: string;
    bio: string;
  };
}

export default function PersonalDetailsForm({ isEditing, personalInfo }: PersonalDetailsFormProps) {
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <span className="text-gray-300 font-medium">Birthday</span>
          <span className="text-white">
            {new Date(personalInfo.birthday).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <span className="text-gray-300 font-medium">Gender</span>
          <span className="text-white">{personalInfo.gender}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <span className="text-gray-300 font-medium">Location</span>
          <span className="text-white">{personalInfo.location}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-3">
          <span className="text-gray-300 font-medium">Favourite Novel:</span>
          <a
            href={personalInfo.favouriteNovel}
            target="_blank"
            rel="noopener noreferrer"
            className="text-violet-400 hover:text-violet-300"
          >
            {personalInfo.favouriteNovel}
          </a>
        </div>
        <div className="space-y-2">
          <div className="text-gray-300 font-medium">About Me</div>
          <div className="text-white text-sm leading-relaxed">{personalInfo.bio}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-gray-300 text-sm font-medium">Birthday</label>
        <Input
          type="date"
          defaultValue={personalInfo.birthday}
          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white rounded-xl text-sm"
        />
      </div>
      <div>
        <label className="text-gray-300 text-sm font-medium">Gender</label>
        <select
          className="mt-1 w-full p-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-xl text-sm"
          defaultValue={personalInfo.gender}
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="text-gray-300 text-sm font-medium">Location</label>
        <Input
          defaultValue={personalInfo.location}
          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white rounded-xl text-sm"
        />
      </div>
      <div>
        <label className="text-gray-300 text-sm font-medium">Favourite Novel:</label>
        <Input
          type="url"
          defaultValue={personalInfo.favouriteNovel}
          className="mt-1 bg-gray-800/50 border-gray-700/50 text-white rounded-xl text-sm"
        />
      </div>
      <div>
        <label className="text-gray-300 text-sm font-medium">About Me</label>
        <textarea
          defaultValue={personalInfo.bio}
          className="mt-1 w-full p-3 bg-gray-800/50 border border-gray-700/50 text-white rounded-xl resize-none text-sm"
          rows={4}
        />
      </div>
    </div>
  );
}
