import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export default function Preferences() {
  const [searchParams] = useSearchParams();
  const leadId = searchParams.get('lead');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [preferences, setPreferences] = useState({
    marketing: false,
    email: false,
    sms: false,
    phone: false
  });

  useEffect(() => {
    async function loadPreferences() {
      if (!leadId) {
        setError('Invalid link. Missing lead identifier.');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase.functions.invoke('preferences-manager', {
          method: 'GET',
          body: { lead: leadId }
        });

        if (fetchError) throw fetchError;
        if (data?.preferences) {
          setPreferences(data.preferences);
        }
      } catch (err: any) {
        console.error('Error loading preferences:', err);
        setError('Failed to load preferences. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [leadId]);

  const handleSave = async () => {
    if (!leadId) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: saveError } = await supabase.functions.invoke('preferences-manager', {
        method: 'POST',
        body: { leadId, preferences }
      });

      if (saveError) throw saveError;
      setSuccess(true);
    } catch (err: any) {
      console.error('Error saving preferences:', err);
      setError('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-slate-100 px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white">Communication Preferences</h1>
          <p className="text-sm text-slate-400 mt-2">Update how you would like to receive updates from us.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
            Your preferences have been successfully updated.
          </div>
        )}

        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-medium text-white">Marketing Updates</h3>
              <p className="text-sm text-slate-400">Receive special offers, vehicle updates, and news.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-1">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.marketing}
                onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          <hr className="border-slate-800" />

          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Channels</h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Email Communications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.email}
                onChange={(e) => setPreferences({...preferences, email: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">SMS / Text Messages</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={preferences.sms}
                onChange={(e) => setPreferences({...preferences, sms: e.target.checked})}
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={handleSave}
            disabled={saving || !leadId}
            className="w-full bg-brand-500 hover:bg-brand-600 text-black"
          >
            {saving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            This page helps ensure compliance with CASL, TCPA, and PIPEDA regulations.
          </p>
        </div>
      </div>
    </div>
  );
}
