export type Event = {
	calendarId: string | undefined;
	title: string;
	description: string | undefined;
	end: string | undefined;
	id: string;
	location: string | undefined;
	start: string;
	people: string[] | undefined | any[];
	createdAt: number | undefined;
	_options:
		| {
				disableDND: boolean | undefined;
				disableResize: boolean | undefined;
				additionalClasses: string[] | undefined;
		  }
		| undefined;
	_customContent:
		| {
				timeGrid: string | undefined;
				dateGrid: string | undefined;
				monthGrid: string | undefined;
				monthAgenda: string | undefined;
		  }
		| undefined;
};
