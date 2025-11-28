import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loading } from '../common';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50/30 via-white to-purple-50/20">
        <Loading size="lg" message="Carregando..." />
      </div>
    );
  }

  if (!user) {
    // Redireciona para login, salvando a página que tentou acessar
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
