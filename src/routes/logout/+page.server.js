import { redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ cookies }) => {
        console.log('Logout action triggered');
        
        // Nur das tatsächlich existierende Cookie löschen
        cookies.set('userId', '', {
            path: '/',
            maxAge: 0
        });
        
        console.log('userId cookie deleted');
        
        // Redirect zur Login-Seite
        throw redirect(302, '/login');
    }
};
