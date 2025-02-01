import type { PageServerLoad } from './$types';
import { getAllEvents, addEvent } from '$lib/server/db';
import { formattedDatetime } from '$lib';


export const load: PageServerLoad = async () => {
	const allEvents = await getAllEvents();
	let events: Array<Event | any> | null = null;
	if (allEvents.length > 0) {
		events = allEvents.map((event) => ({ ...event, start: formattedDatetime(Number(event.start)), end: formattedDatetime(Number(event.end)) }))
	}
	return {
		events
	};
};
