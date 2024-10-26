// place files you want to import through the `$lib` alias in this folder.

export function formattedDatetime(datetime: number) {
	const d = new Date(datetime);
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();
	const hour = d.getHours();
	const minute = d.getMinutes();
	return `${year}-${month}-${day} ${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
}
