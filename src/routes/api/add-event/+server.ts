import type { RequestHandler } from "./$types";
import { addEvent } from "$lib/server/db";


export const POST: RequestHandler = async ({ url, request }) => {
    try {
        const body = await request.json();
        console.log('body', body); //! DEBUG
        const result = await addEvent(body);
        if (!result) return new Response(JSON.stringify({ success: false, msg: 'failed to add event' }), {
            status: 400
        })

        return new Response(JSON.stringify({ success: true, msg: 'success' }))
    } catch (error) {
        // console.error(error); //! DEBUG
        return new Response(JSON.stringify({ success: false, msg: error }), {
            status: 400
        })
    }
}