import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../components/ui/button';
import { supabase } from '@/integrations/supabase/client';

// Zod schemas for validation
const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? '/app';

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(redirectTo, { replace: true });
      }
    };
    checkSession();
  }, [navigate, redirectTo]);

  const {
    register: registerSignIn,
    handleSubmit: handleSubmitSignIn,
    formState: { errors: errorsSignIn },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const {
    register: registerSignUp,
    handleSubmit: handleSubmitSignUp,
    formState: { errors: errorsSignUp },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const onSignIn = async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
      // Log security event (simulated)
      console.error('auth_failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      setSuccessMessage('Account created! Please check your email to confirm your account.');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const email = import.meta.env.VITE_DEMO_EMAIL;
    const password = import.meta.env.VITE_DEMO_PASSWORD;

    if (!email || !password) {
      console.error('Demo credentials are not configured');
      return;
    }

    setIsLoading(true);
    await supabase.auth.signInWithPassword({
      email,
      password
    });
    navigate(redirectTo, { replace: true });
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
      <div className="w-full max-w-lg flex-col gap-6 px-6 py-16">
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AutoRepAi</p>
          <h1 className="text-3xl font-semibold mt-2">
            {authMode === 'signin' ? 'Sign in to your workspace' : 'Create an account'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Use Supabase Auth or connect via enterprise SSO.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6" role="tablist">
            <button
              role="tab"
              aria-selected={authMode === 'signin'}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${
                authMode === 'signin'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setAuthMode('signin')}
            >
              Sign In
            </button>
            <button
              role="tab"
              aria-selected={authMode === 'signup'}
              className={`pb-2 px-4 text-sm font-medium transition-colors ${
                authMode === 'signup'
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              onClick={() => setAuthMode('signup')}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
              {successMessage}
            </div>
          )}

          {authMode === 'signin' ? (
            <form onSubmit={handleSubmitSignIn(onSignIn)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="name@example.com"
                  {...registerSignIn('email')}
                />
                {errorsSignIn.email && (
                  <p className="mt-1 text-xs text-red-400">{errorsSignIn.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300" htmlFor="password">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  {...registerSignIn('password')}
                />
                {errorsSignIn.password && (
                  <p className="mt-1 text-xs text-red-400">{errorsSignIn.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmitSignUp(onSignUp)} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="John Doe"
                  {...registerSignUp('fullName')}
                />
                {errorsSignUp.fullName && (
                  <p className="mt-1 text-xs text-red-400">{errorsSignUp.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300" htmlFor="signup-email">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  placeholder="name@example.com"
                  {...registerSignUp('email')}
                />
                {errorsSignUp.email && (
                  <p className="mt-1 text-xs text-red-400">{errorsSignUp.email.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300" htmlFor="signup-password">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                  {...registerSignUp('password')}
                />
                {errorsSignUp.password && (
                  <p className="mt-1 text-xs text-red-400">{errorsSignUp.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>

          <Button variant="outline" onClick={handleDemoLogin} className="w-full" disabled={isLoading}>
            Demo Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
