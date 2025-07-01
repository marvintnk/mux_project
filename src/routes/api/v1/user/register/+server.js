import {swapBoxService} from "$lib/api/swapbox.service.js";
import {json} from "@sveltejs/kit";

export async function POST({ request }) {
    const { name, email, password_hash } = await request.json();

    if (await swapBoxService.getUserByEmail(email.toLowerCase())) {
        return json({ message: "Ein Benutzer mit dieser E-Mail existiert bereits." }, { status: 400 });
    }

    await swapBoxService.createUser({
        name: name,
        email: email.toLowerCase(),
        password_hash: password_hash,
        verified: false,
        role: 'student'
    });

    return json(undefined, { status: 200 });
}
