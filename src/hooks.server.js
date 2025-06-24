// @ts-ignore
import { swapBoxService } from '$lib/api/swapbox.service.js';

export async function handle({ event, resolve }) {
  const userId = event.cookies.get('userId');

  console.log('🍪 Cookie userId:', userId);

  
  if (userId) {
    try {
      const user = await swapBoxService.getUserById(userId);
      
      console.dir(user);

      if (user) {
        // User-Daten in locals speichern
        event.locals.user = user;
      } else {
        // User existiert nicht mehr
        event.locals.user = null;
      }
    } catch (error) {
      console.error('Error loading user in hooks:', error);
      event.locals.user = null;
    }
  } else {
    event.locals.user = null;
  }

  return await resolve(event);
}
