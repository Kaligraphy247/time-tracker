<script lang="ts">
	// Calendar Imports
	import { ScheduleXCalendar } from '@schedule-x/svelte';
	import { createCalendar, createViewDay, createViewWeek } from '@schedule-x/calendar';
	import { createViewMonthAgenda, createViewMonthGrid } from '@schedule-x/calendar';
	import { createCurrentTimePlugin } from '@schedule-x/current-time';
	import { createEventsServicePlugin } from '@schedule-x/events-service';
	import type { CalendarEvent } from '@schedule-x/calendar';
	import '@schedule-x/theme-default/dist/index.css';
	// custom
	import AddEventModal from '$lib/components/AddEventModal.svelte';
	import ViewEventModal from '$lib/components/ViewEventModal.svelte';

	// States
	const { data } = $props();
	const events = $state(data.events) as CalendarEvent[];

	/** Selected Datetime, for AddEventModal */
	let selectedDateTime: string = $state('');

	/** AddEventModal modal open state */
	let eventModalOpen: boolean = $state(false);

	/** ViewEventModal modal open state */
	let viewEventOpen: boolean = $state(false);

	/** Selected Event, for ViewEventModal */
	let selectedEvent: CalendarEvent | null = $state(null);

	function loadEvents() {
		calendarApp.events.set(events);
	}

	const calendarApp = createCalendar({
		views: [createViewDay(), createViewWeek(), createViewMonthAgenda(), createViewMonthGrid()],
		plugins: [createCurrentTimePlugin({ fullWeekWidth: false }), createEventsServicePlugin()],
		isDark: true,
		isResponsive: true,
		dayBoundaries: {
			start: '04:00',
			end: '22:00'
		},
		weekOptions: {
			gridHeight: 900
		},
		events: [],
		callbacks: {
			onEventClick: (event) => {
				console.log(event); //! DEBUG
				viewEventOpen = true;
				selectedEvent = event;
				// alert(event.title);
			},
			onClickDate: (data) => {
				// Month view
				console.log('onClickDate', data);
			},
			onClickDateTime(dateTime) {
				console.log('onClickDateTime', dateTime); // e.g. 2024-01-01 12:37
				selectedDateTime = dateTime;
				eventModalOpen = true;
			},
			onRender: ($app) => {
				// console.log('onRender', $app);
				loadEvents();
			}
		}
	});
</script>

<!-- Markup -->
<div class="sx-svelte-calendar-wrapper">
	<ScheduleXCalendar {calendarApp} />
</div>
<AddEventModal bind:open={eventModalOpen} {selectedDateTime} />

<ViewEventModal data={selectedEvent} bind:open={viewEventOpen} />

<!-- End Markup -->

<style>
	:root {
		font-family: 'Roboto', sans-serif;
	}
	.sx-svelte-calendar-wrapper {
		width: 100%;
		max-width: 100vw;
		height: 100vh;
		max-height: 90vh;
	}
</style>
