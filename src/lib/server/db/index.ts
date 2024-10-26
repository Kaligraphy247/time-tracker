import { getDb } from "./utils";
import type { Event } from "./types";
import { jsonify } from "surrealdb";



export async function addEvent(event: Event): Promise<boolean> {
    // const 
    const db = await getDb();
    const result = await db.create<Event>('events', event);
    await db.close();
    if (!result) return false;
    return true;
}


export async function getAllEvents(): Promise<Event[]> {
    const db = await getDb();
    const result = await db.select<Event>('events');
    await db.close();
    if (!result) return [];
    return jsonify(result);
}


// export default function () {

// }