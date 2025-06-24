import { swapBoxService } from '$lib/api/swapbox.service.js';

export async function handle({ event, resolve }) {
  const userId = event.cookies.get('userId');
  
  if (userId) {
    try {
      const user = await swapBoxService.getUserById(parseInt(userId));
      
      if (user) {
        // User-Daten in locals speichern
        event.locals.user = user;
        event.locals.userId = user.id;
        event.locals.isAuthenticated = true;
      } else {
        // User existiert nicht mehr - Cookie löschen
        event.cookies.delete('userId', { path: '/' });
        event.locals.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error loading user in hooks:', error);
      // Ungültiges Cookie - löschen
      event.cookies.delete('userId', { path: '/' });
      event.locals.isAuthenticated = false;
    }
  } else {
    event.locals.isAuthenticated = false;
  }

  return await resolve(event);
}
