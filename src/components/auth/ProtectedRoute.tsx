import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../config/axios.config';
import { AxiosError } from 'axios';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        await axiosInstance.get('users/me');
        setIsAuthenticated(true);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          localStorage.removeItem('accessToken');
        }
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 