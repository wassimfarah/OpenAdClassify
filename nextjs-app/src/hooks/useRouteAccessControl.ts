// src/hooks/useAuthProtection.tsx
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { RootState } from '@/Redux/store';
import { usePathname } from 'next/navigation';
import { protectedRoutes, restrictedRoutes } from '@/config/routesConfig';

const useRouteAccessControl = () => {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname using usePathname
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  useEffect(() => {
    console.log("Checking authentication status");

    const isProtected = protectedRoutes.includes(pathname);
    const isRestricted = restrictedRoutes.includes(pathname);

    // Redirect if trying to access a protected route while not logged in
    if (isProtected && !loggedIn) {
      router.push('/login');
    }

    // Redirect if logged in and trying to access login or register page
    else if (loggedIn && isRestricted) {
      router.push('/');
    }
  }, [loggedIn, pathname, router]);
};

export default useRouteAccessControl;
