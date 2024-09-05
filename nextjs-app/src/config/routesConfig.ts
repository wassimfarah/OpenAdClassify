const protectedRoutes = [
    '/protected',
     '/dashboard',
      '/admin',
      '/createAd/sell',
      '/messages'
    ]; // Routes that require authentication
const restrictedRoutes = ['/login', '/register']; // Routes that logged-in users cannot access

export { protectedRoutes, restrictedRoutes };
