import { getDb } from './utils';
import type { Event } from './types';
import { jsonify, PreparedQuery, surql } from 'surrealdb';

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
	const result = (await db.select<Event>('events'));
	await db.close();
	if (!result) return [];
	return jsonify(result);
}

export async function getFilteredEvents(from: number, to: number, limit?: number | string): Promise<Event[]> {
	const db = await getDb();
	const stmt = [
		'SELECT * FROM events WHERE', 
		`start >= ${from}`,
		`AND`,
		`end <= ${to}`,
		`ORDER start asc`,
		`LIMIT ${limit ? limit : 100};`,
	].join(' ').trim();
	// console.log(stmt);
	const result = await db.query<[Event[], Event[]]>(stmt);
	if (result && result[0].length === 0) return [];
	return jsonify(result[0]);
	// const [result] = await db.query(surql`SELECT * FROM events WHERE start.starts_with(${from})`);
	// const [result] = await db.query('SELECT * FROM events WHERE string::starts_with(start, $from) AND string::starts_with(end, $to) LIMIT $limit;', { from, to, limit });
	// console.log(result);	
	// return []
}