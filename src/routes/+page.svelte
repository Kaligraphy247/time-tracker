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
	import { formattedDatetime } from '$lib';
	const { data } = $props();
	const events = $state(data.events) as CalendarEvent[];

	function loadEvents() {
		calendarApp.events.set(events);
	}

	const calendarApp = createCalendar({
		// views: [createViewDay(), createViewWeek()],
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
				console.log(event);
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

	let selectedDateTime: string = $state('');
	let eventModalOpen: boolean = $state(false);
	$effect(() => {
		console.log('eventModalOpen', eventModalOpen);
		// console.log('selectedDateTime', selectedDateTime);
	});

	// add new event
	const addEvent = async (start: string) => {
		let selectedDate = Date.parse(start);
		let endDate = selectedDate + 1000 * 60 * 60 * 4;
		console.log('selectedDate', selectedDate, endDate);

		const newEvent = {
			id: String(crypto.randomUUID()),
			title: 'New event with DateTime',
			start: formattedDatetime(selectedDate),
			end: formattedDatetime(endDate),
			createdAt: Date.now() / 1000
		};

		console.log('newEvent', newEvent);
		events.push(newEvent);
		calendarApp.events.add(newEvent);

		// persist in db
		const response = await fetch('/api/add-event', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(newEvent)
		});

		if (!response.ok) {
			console.error('Error:', response.statusText);
			alert('Error: ' + response.statusText);
			return;
		}
		alert('Event added successfully!');
		eventModalOpen = !eventModalOpen;
	};
</script>

<div class="sx-svelte-calendar-wrapper">
	<ScheduleXCalendar {calendarApp} />
</div>
<AddEventModal
	bind:open={eventModalOpen}
	{selectedDateTime}
	saveAction={() => addEvent(selectedDateTime)}
/>

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
