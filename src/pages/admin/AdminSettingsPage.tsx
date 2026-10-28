import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Settings, Sparkles, Save } from 'lucide-react';
import { toast } from 'sonner';

interface AIRankingSettings {
  grantsEnabled: boolean;
  challengesEnabled: boolean;
  mentorsEnabled: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<AIRankingSettings>({
    grantsEnabled: true,
    challengesEnabled: true,
    mentorsEnabled: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API call when backend is ready
      // const response = await adminSettingsApi.getAIRankingSettings();
      // setSettings(response);
      
      // For now, load from localStorage
      const savedSettings = localStorage.getItem('admin_ai_ranking_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      console.log('Settings loaded:', settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (module: keyof AIRankingSettings) => {
    setSettings((prev) => ({
      ...prev,
      [module]: !prev[module],
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      console.log('Saving settings:', settings);
      
      // TODO: Replace with actual API call when backend is ready
      // await adminSettingsApi.updateAIRankingSettings(settings);
      
      // For now, save to localStorage
      localStorage.setItem('admin_ai_ranking_settings', JSON.stringify(settings));
      
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-7 h-7" />
              Admin Settings
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Configure platform features and AI ranking availability
            </p>
          </div>
        </div>

        {/* AI Ranking Settings Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                AI Ranking Settings
              </h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Control which modules have AI-powered ranking available to founders.
              When disabled, founders won't see the AI toggle on those pages.
            </p>
          </div>

          <div className="px-6 py-6 space-y-6">
            {/* Grants Toggle */}
            <SettingRow
              label="Grants AI Ranking"
              description="Enable AI-powered grant recommendations based on founder profiles"
              enabled={settings.grantsEnabled}
              onToggle={() => handleToggle('grantsEnabled')}
              icon="💰"
            />

            {/* Challenges Toggle */}
            <SettingRow
              label="Challenges AI Ranking"
              description="Enable AI-powered challenge recommendations based on founder profiles"
              enabled={settings.challengesEnabled}
              onToggle={() => handleToggle('challengesEnabled')}
              icon="🎯"
            />

            {/* Mentors Toggle */}
            <SettingRow
              label="Mentors AI Ranking"
              description="Enable AI-powered mentor recommendations based on founder profiles"
              enabled={settings.mentorsEnabled}
              onToggle={() => handleToggle('mentorsEnabled')}
              icon="🤝"
            />
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Changes take effect immediately after saving
              </p>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            📌 How AI Ranking Works
          </h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>When enabled, founders see an AI toggle on the respective pages</li>
            <li>AI ranks items based on founder's stage, sector, and profile</li>
            <li>Disabled modules hide the AI toggle completely from founders</li>
            <li>Regular sorting (by deadline, date, etc.) remains available</li>
          </ul>
        </div>

        {/* Backend Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">
            ⚠️ Development Note
          </h3>
          <p className="text-sm text-amber-800">
            Settings are currently stored in localStorage. Once the backend API is implemented at{' '}
            <code className="bg-amber-100 px-1 py-0.5 rounded">
              GET/PUT /api/v1/admin/settings/ai-ranking
            </code>
            , this will be updated to use the API for persistence across sessions.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}

/* Setting Row Component */
interface SettingRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
  icon: string;
}

function SettingRow({ label, description, enabled, onToggle, icon }: SettingRowProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3 flex-1">
        <div className="text-2xl mt-1">{icon}</div>
        <div>
          <label className="text-base font-medium text-gray-900 block">
            {label}
          </label>
          <p className="text-sm text-gray-600 mt-0.5">
            {description}
          </p>
        </div>
      </div>
      
      {/* Toggle Switch */}
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 ${
          enabled ? 'bg-indigo-600' : 'bg-gray-200'
        }`}
        role="switch"
        aria-checked={enabled}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
