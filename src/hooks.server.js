// @ts-ignore
import { swapBoxService } from '$lib/api/swapbox.service.js';
import { redirect } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const userId = event.cookies.get('userId');
  const pathname = event.url.pathname;

  console.log('🍪 Cookie userId:', userId);
  console.log('🌐 Route:', pathname);

  if (userId) {
    try {
      const user = await swapBoxService.getUserById(userId);
      
      if (user) {
        event.locals.user = user;
      } else {
        event.locals.user = null;
        event.cookies.set('userId', '', { path: '/', maxAge: 0 });
      }
    } catch (error) {
      console.error('Error loading user in hooks:', error);
      event.locals.user = null;
      event.cookies.set('userId', '', { path: '/', maxAge: 0 });
    }
  } else {
    event.locals.user = null;
  }

  // ========== ROUTE PROTECTION ==========
  
  // Nur diese Routen sind ohne Login erlaubt
  const publicRoutes = ['/login', '/register'];
  
  // API-Routen ausschließen (falls vorhanden)
  const isApiRoute = pathname.startsWith('/api');
  
  // Prüfen ob Route öffentlich ist
  const isPublicRoute = publicRoutes.includes(pathname);
  
  // ALLE anderen Routen sind geschützt (inklusive '/')
  const isProtectedRoute = !isPublicRoute && !isApiRoute;

  // Redirect zu Login wenn nicht authentifiziert und geschützte Route
  if (isProtectedRoute && !event.locals.user) {
    console.log(`🔒 Protected route ${pathname} - redirecting to login`);
    throw redirect(307, `/login?redirect=${encodeURIComponent(pathname)}`);
  }

  // Redirect zu Start wenn authentifiziert und auf Login/Register-Seite
  if ((pathname === '/login' || pathname === '/register') && event.locals.user) {
    console.log('✅ User already logged in - redirecting to home');
    throw redirect(307, '/');
  }

  // Response mit Cache-Control für geschützte Routen
  const response = await resolve(event);
  
  if (isProtectedRoute) {
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
  }

  console.log(`✅ Route ${pathname} - User: ${event.locals.user ? event.locals.user.name : 'Not logged in'}`);

  return response;
}
