import type { RequestHandler } from './$types';
import { editEvent } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const result = await editEvent(body);
		if (!result)
			return new Response(JSON.stringify({ success: false, msg: 'failed to add event' }), {
				status: 400
			});

		return new Response(JSON.stringify({ success: true, msg: 'success' }));
	} catch (error) {
		// console.error(error); //! DEBUG
		return new Response(JSON.stringify({ success: false, msg: error }), {
			status: 400
		});
	}
};
