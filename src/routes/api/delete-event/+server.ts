import type { RequestHandler } from './$types';
import { deleteEvent } from '$lib/server/db';

export const DELETE: RequestHandler = async ({ request }) => {
	try {
		const params = new URL(request.url).searchParams;
		const id = params.get('id');
		if (!id)
			return new Response(JSON.stringify({ success: false, msg: 'missing id' }), { status: 400 });

		const result = await deleteEvent(id);
		if (!result)
			return new Response(JSON.stringify({ success: false, msg: 'failed to delete event' }), {
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
