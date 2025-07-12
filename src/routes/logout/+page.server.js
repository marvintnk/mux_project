import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    cookies.set('userId', '', {
        path: '/',
        maxAge: 0
    });

    throw redirect(303, '/');
}
