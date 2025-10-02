import { Lock, Globe, Eye, Bell } from 'lucide-react';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';

interface SettingsTabProps {
  email: string;
  isPrivate: boolean;
  setIsPrivate: (value: boolean) => void;
}

export default function SettingsTab({ email, isPrivate, setIsPrivate }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      {/* Privacy Settings */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4">Privacy Settings</h3>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-white font-medium">Profile Visibility</div>
              <div className="text-gray-400 text-sm">Control who can see your profile</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 text-sm"
              onClick={() => setIsPrivate(!isPrivate)}
            >
              {isPrivate ? (
                <>
                  <Lock className="w-4 h-4 mr-2 text-orange-400" />
                  Private
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-2 text-green-400" />
                  Public
                </>
              )}
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="text-white font-medium">Reading Activity</div>
              <div className="text-gray-400 text-sm">Show your reading activity to others</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 text-sm"
            >
              <Eye className="w-4 h-4 mr-2 text-green-400" />
              Visible
            </Button>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4">Account Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm font-medium">Email</label>
            <Input
              defaultValue={email}
              className="mt-1 bg-gray-800/50 border-gray-700/50 text-white rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-gray-300 text-sm font-medium">Password</label>
            <Button
              variant="outline"
              className="mt-1 w-full bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 rounded-xl justify-start text-sm"
            >
              Change Password
            </Button>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-gray-700/20">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-violet-400" />
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {['New Chapters', 'Comments & Replies', 'Reading Goals'].map((label, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div>
                <div className="text-white font-medium">{label}</div>
                <div className="text-gray-400 text-sm">
                  {label === 'New Chapters'
                    ? 'Get notified when novels you follow update'
                    : label === 'Comments & Replies'
                    ? 'Get notified when someone replies to your comments'
                    : 'Get reminders about your reading goals'}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-green-500/20 border-green-500/50 text-green-400 hover:bg-green-500/30 text-sm"
              >
                On
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
