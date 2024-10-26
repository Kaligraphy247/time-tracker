import type { PageServerLoad } from "./$types";
import { getAllEvents } from "$lib/server/db";

export const load: PageServerLoad = async () => {
    const events = await getAllEvents();
    // const events = JSON.stringify(await getAllEvents());
    // console.log('events', typeof events);
    // events: JSON.stringify(events)
    return {
        events
    };
};