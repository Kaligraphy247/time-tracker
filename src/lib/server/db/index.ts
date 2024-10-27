import { getDb } from './utils';
import type { Event } from './types';
import { jsonify } from 'surrealdb';

export async function addEvent(event: Event): Promise<boolean> {
	const db = await getDb();
	const result = await db.create<Event>('events', event);
	await db.close();
	if (!result) return false;
	return true;
}

export async function editEvent(event: Event): Promise<boolean> {
	const db = await getDb();
	const stmt = `
	UPDATE events SET
		title = '${event.title}',
		start = '${event.start}',
		end = '${event.end}'
	WHERE id = ${event.id};
	`;
	const result = await db.query(stmt);
	console.log(result.flat(3));
	await db.close();
	if (!result) return false;
	return true;
}

export async function deleteEvent(id: string): Promise<boolean> {
	const db = await getDb();
	const stmt = `
	DELETE FROM events WHERE id = ${id};
	`;
	const result = await db.query(stmt);
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
