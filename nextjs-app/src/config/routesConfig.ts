const protectedRoutes = [
    '/protected',
     '/dashboard',
      '/admin',
      '/createAd/sell',
      '/messages',
      '/update-ad',
      '/ads-history'
    ]; // Routes that require authentication
const restrictedRoutes = ['/login', '/register']; // Routes that logged-in users cannot access

export { protectedRoutes, restrictedRoutes };
