'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/Redux/store';
import { protectedRoutes } from '@/config/routesConfig';
import { usePathname } from 'next/navigation';


const RouteAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isProtected = protectedRoutes.includes(pathname);

      if (isProtected && !loggedIn) {
        router.push('/login');
      } else if (loggedIn && ['/login', '/register'].includes(pathname)) {
        router.push('/');
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [loggedIn, pathname, router]);

  if (loading) {
    return <div></div>; // Show loading state while auth is checked
  }

  return <>{children}</>; // Render protected content if auth check is complete
};

export default RouteAuthGuard;
