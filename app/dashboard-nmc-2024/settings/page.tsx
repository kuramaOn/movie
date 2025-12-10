'use client';

import { useState, useEffect } from 'react';
import {
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  ServerIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Network Chanel',
    siteUrl: '',
    adminEmail: '',
    autoSync: true,
    syncInterval: 24,
    notifications: true,
    maintenanceMode: false,
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load settings (in real app, fetch from API)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    setSettings(prev => ({ ...prev, siteUrl }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your site configuration and preferences</p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
        }`}>
          {message.text}
        </div>
      )}

      {/* General Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <GlobeAltIcon className="h-6 w-6 text-netflix-red" />
          <h2 className="text-xl font-bold text-white">General Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site Name
            </label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Site URL
            </label>
            <input
              type="url"
              value={settings.siteUrl}
              onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Admin Email
            </label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
              placeholder="admin@example.com"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
        </div>
      </div>

      {/* Feed Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <ServerIcon className="h-6 w-6 text-netflix-red" />
          <h2 className="text-xl font-bold text-white">Feed Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Auto-Sync Feeds</p>
              <p className="text-sm text-gray-400">Automatically sync feeds at regular intervals</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, autoSync: !settings.autoSync })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.autoSync ? 'bg-netflix-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.autoSync ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sync Interval (hours)
            </label>
            <input
              type="number"
              value={settings.syncInterval}
              onChange={(e) => setSettings({ ...settings, syncInterval: parseInt(e.target.value) })}
              min="1"
              max="168"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-netflix-red"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="h-6 w-6 text-netflix-red" />
          <h2 className="text-xl font-bold text-white">Notifications</h2>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">Email Notifications</p>
            <p className="text-sm text-gray-400">Receive email alerts for important events</p>
          </div>
          <button
            onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              settings.notifications ? 'bg-netflix-red' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                settings.notifications ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheckIcon className="h-6 w-6 text-netflix-red" />
          <h2 className="text-xl font-bold text-white">Security</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Maintenance Mode</p>
              <p className="text-sm text-gray-400">Temporarily disable the site for maintenance</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                settings.maintenanceMode ? 'bg-netflix-red' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <button className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white transition flex items-center justify-center gap-2">
            <KeyIcon className="h-5 w-5" />
            <span>Change Admin Password</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-netflix-red hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition font-medium"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
