import { useEffect, useState, type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [hasTenant, setHasTenant] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (session) {
        setHasSession(true);
        // Ensure user has an associated dealership context (tenant)
        const dealershipId = session.user?.user_metadata?.dealership_id;
        if (dealershipId) {
          setHasTenant(true);
        } else {
          // If no metadata, attempt to lookup user role / tenant
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('dealership_id')
            .eq('user_id', session.user.id)
            .single();

          if (profile?.dealership_id) {
             setHasTenant(true);
          } else {
             console.error("User missing dealership_id / tenant assignment.");
          }
        }
      }
      setIsLoading(false);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setHasSession(Boolean(session));
        if (session?.user?.user_metadata?.dealership_id) {
           setHasTenant(true);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-slate-300">
        Checking authentication...
      </div>
    );
  }

  if (!hasSession) {
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  if (!hasTenant && import.meta.env.PROD) {
      return (
        <div className="flex flex-col h-[60vh] items-center justify-center text-slate-300 gap-4">
          <p className="text-xl font-bold text-red-400">Access Denied</p>
          <p>Your account is not associated with a registered dealership.</p>
        </div>
      );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
