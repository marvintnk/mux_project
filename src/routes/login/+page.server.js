import { fail, redirect } from '@sveltejs/kit';
import { swapBoxService } from '$lib/api/swapbox.service.js';

export const actions = {
  signin: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get('email');
    const password = data.get('password');

    // Validierung
    if (!email || !password) {
      return fail(400, { 
        error: 'E-Mail und Passwort sind erforderlich.',
        email 
      });
    }

    if (!email.endsWith('@th-brandenburg.de')) {
      return fail(400, { 
        error: 'Nur E-Mail-Adressen der TH Brandenburg sind erlaubt.',
        email 
      });
    }

    try {
      // Benutzer aus Datenbank laden
      const userData = await swapBoxService.getUserByEmail(email);
      
      if (!userData) {
        return fail(400, { 
          error: 'Benutzer nicht gefunden.',
          email 
        });
      }

      // Passwort verifizieren (hier müssen Sie Ihre Passwort-Verifikation einbauen)
      const isPasswordValid = await verifyPassword(password, userData.password_hash);
      
      if (!isPasswordValid) {
        return fail(400, { 
          error: 'Ungültiges Passwort.',
          email 
        });
      }

      if (!userData.verified) {
        return fail(400, { 
          error: 'Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.',
          email 
        });
      }

      // Session Cookie setzen (7 Tage gültig)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);

      cookies.set('userId', userData.id.toString(), {
        path: '/',
        expires: expirationDate,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      // Erfolgreiche Anmeldung - Weiterleitung
      throw redirect(303, '/');

    } catch (error) {
      if (error.status === 303) {
        // Redirect durchlassen
        throw error;
      }
      
      console.error('Login error:', error);
      return fail(500, { 
        error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
        email 
      });
    }
  }
};

// Hilfsfunktion für Passwort-Verifikation
async function verifyPassword(password, hashedPassword) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex === hashedPassword;
}
