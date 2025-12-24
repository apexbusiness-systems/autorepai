import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/app';

  const handleDemoLogin = async () => {
    await supabase.auth.signInWithPassword({
      email: 'demo@autorepai.ca',
      password: 'demo-password'
    });
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-6 py-16">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AutoRepAi</p>
          <h1 className="text-3xl font-semibold">Sign in to your workspace</h1>
          <p className="mt-2 text-sm text-slate-400">
            Use Supabase Auth or connect via enterprise SSO.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <p className="text-sm text-slate-300">
            Demo mode uses Supabase Auth with email + password. Replace with your tenant
            identity provider in production.
          </p>
          <Button onClick={handleDemoLogin} className="mt-4 w-full">
            Continue with demo account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
