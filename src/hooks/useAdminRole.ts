import { useAuth } from '@/contexts/AuthContext';

export const useAdminRole = () => {
  const { userRole, user, loading } = useAuth();
  
  const isAdmin = userRole === 'admin' || userRole === 'super_admin';
  const isSuperAdmin = userRole === 'super_admin';
  const isAuthenticated = !!user;
  
  return {
    isAdmin,
    isSuperAdmin,
    isAuthenticated,
    userRole,
    loading,
  };
};