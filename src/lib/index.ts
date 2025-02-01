// place files you want to import through the `$lib` alias in this folder.

/**
 * Format a datetime in ms to a string in the format of 'YYYY-MM-DD HH:MM'.
 *
 * @param datetime - The datetime in ms to format.
 * @returns The formatted datetime string.
 */
export function formattedDatetime(datetime: number) {
	const d = new Date(datetime);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const hour = d.getHours();
	const minute = d.getMinutes();
	const date = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`
	const time = `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
	return `${date} ${time}`
}

/**
 * Splits a datetime string into separate date and time components.
 *
 * @param datetime - A string representing a datetime in the format "YYYY-MM-DD HH:MM".
 * @returns An object containing the `date` and `time` as separate strings.
 */
export function splitDatetime(datetime: string) {
	// check if datetime is in format "YYYY-MM-DD HH:MM"
	if (/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(datetime)) {
		const date = String(datetime).split(' ')[0].trim();
		const time = String(datetime).split(' ')[1].trim();
		return { date, time };
	}
	return { date: '', time: '' };
}



/**
 * Calculate the total time between two datetime strings in hours, minutes, and ms.
 *
 * @param start - A string representing a datetime in the format "YYYY-MM-DD HH:MM".
 * @param end - A string representing a datetime in the format "YYYY-MM-DD HH:MM".
 * @returns An object with `hours`, `minutes`, and `totalTime` properties.
 */
export function getElapsedTime(start: string, end: string) {
	const totalTime = Date.parse(end) - Date.parse(start);
	const hours = Math.floor(totalTime / (1000 * 60 * 60));
	const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
	return { hours, minutes, totalTime };
}


/**
 * Converts a timestamp in milliseconds to hours.
 *
 * @param timestamp - The timestamp in milliseconds.
 * @returns The number of hours in the given timestamp.
 */
export function getHours(timestamp: number) {
	return Math.floor(timestamp / (1000 * 60 * 60));
}


/**
 * Converts a timestamp in milliseconds to minutes.
 *
 * @param timestamp - The timestamp in milliseconds.
 * @returns The number of minutes in the given timestamp.
 */
export function getMinutes(timestamp: number) {
	return Math.floor((timestamp % (1000 * 60 * 60)) / (1000 * 60));
}
