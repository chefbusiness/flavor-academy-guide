import { Navigate } from 'react-router-dom';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requireSuperAdmin?: boolean;
}

export const AdminProtectedRoute = ({ 
  children, 
  requireSuperAdmin = false 
}: AdminProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isSuperAdmin, loading } = useAdminRole();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (!requireSuperAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};