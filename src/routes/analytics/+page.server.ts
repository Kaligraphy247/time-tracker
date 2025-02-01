import type { PageServerLoad } from './$types';
import { getAllEvents, getFilteredEvents } from '$lib/server/db';
import { formattedDatetime } from '$lib';

export const load: PageServerLoad = async ({ url }) => {
	let events: Array<Event | any> | null = null;
	const search = url.searchParams;
	let from: string | number | null = search.get('from');
	let to: Date | string | number | null = search.get('to');
	if (from || to) {
		from = from ? new Date(from).getTime() : Date.now() // TODO: little oversight here, fix it later
		to = to ? new Date(to) : new Date(Date.now() + (60 * 60 * 30 * 24 * 1000)) // one month
		to.setUTCHours(23);
		to.setUTCMinutes(59);
		to.setUTCSeconds(59);
		to.setUTCMilliseconds(999);
		to = to.getTime()
		events = await getFilteredEvents(from, to);
		events = events.map((event) => ({ ...event, start: formattedDatetime(Number(event.start)), end: formattedDatetime(Number(event.end)) }))
	} else {
		const allEvents = await getAllEvents();
		if (allEvents.length > 0) {
			events = allEvents.map((event) => ({ ...event, start: formattedDatetime(Number(event.start)), end: formattedDatetime(Number(event.end)) }))
			events = events.sort((a, b) => a.createdAt - b.createdAt)
		}
	}

	return {
		events: events || []
	};
};
