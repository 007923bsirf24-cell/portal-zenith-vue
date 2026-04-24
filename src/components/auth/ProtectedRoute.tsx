import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Permission } from '@/lib/auth/types';
import { hasPermission } from '@/lib/auth/permissions';

interface Props {
  children: React.ReactNode;
  /** Optional permission requirement */
  requirePermission?: Permission;
}

export function ProtectedRoute({ children, requirePermission }: Props) {
  const { currentUser, loading, rolePermissions } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requirePermission && !hasPermission(currentUser, requirePermission, rolePermissions)) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-foreground">Access denied</h2>
        <p className="text-muted-foreground mt-2">
          You don't have permission to view this page. Contact your administrator if you believe this is an error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
