import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;
      setHasSession(Boolean(data.session));
      setIsLoading(false);
    };

    getSession();

    return () => {
      isMounted = false;
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

  return <>{children}</>;
};

export default ProtectedRoute;
