<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import TimerSvg from './ui/svg/timerSvg.svelte';
	import { Button } from '$lib/components/ui/button';
	import { splitDatetime, formattedDatetime } from '$lib';

	type Props = {
		selectedDateTime: string;
		open: boolean;
		// saveAction: () => void;
	};

	let { open = $bindable(), ...props }: Props = $props();
	let startDate: string = $state('');
	let endDate: string = $state('');
	let newEvent = $state({
		id: '',
		title: '',
		start: '',
		end: '',
		createdAt: 0
	});

	/** Version to be sent to API */
	// This whole formNewEvent object is probably not necessary
	let formNewEvent = $derived.by(() => {
		return {
			...newEvent,
			start: `${startDate} ${newEvent.start}`,
			end: `${endDate} ${newEvent.end}`
		};
	});

	const saveNewEvent = async () => {
		// Set id and createdAt
		formNewEvent.id = String(crypto.randomUUID());
		formNewEvent.createdAt = Date.now() / 1000;
		console.log(formNewEvent);
		const body = {
			...formNewEvent,
			start: new Date(formNewEvent.start).getTime(),
			end: new Date(formNewEvent.end).getTime()
		}
		const response = await fetch('/api/add-event', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			console.error('Error:', response.statusText);
			alert('Error: ' + response.statusText);
			return;
		}

		alert('Event added successfully!');
		// reset
		newEvent.title = '';
	};

	$effect(() => {
		// update when any referenced state changes
		startDate = splitDatetime(props.selectedDateTime).date;
		endDate = splitDatetime(props.selectedDateTime).date;
		newEvent.start = splitDatetime(props.selectedDateTime).time;

		// end time is set to 4 hours after start time
		newEvent.end = splitDatetime(
			formattedDatetime(Date.parse(props.selectedDateTime) + 1000 * 60 * 60 * 4)
		).time;
	});
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => (open = isOpen)} onOutsideClick={() => !open}>
	<Dialog.Trigger></Dialog.Trigger>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>Add your working time</Dialog.Title>
			<Dialog.Description></Dialog.Description>
		</Dialog.Header>
		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
				>Title</label
			>
			<input
				class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
				type="text"
				id="title"
				placeholder="Title"
				bind:value={newEvent.title}
			/>
		</div>
		<section class="grid w-full grid-cols-2 gap-4">
			<div>
				<label for="start-date" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>From</label
				>
				<div class="relative">
					<input
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="date"
						id="start-date"
						bind:value={startDate}
					/>
				</div>
			</div>
			<div>
				<label for="end-date" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>To</label
				>
				<div class="relative">
					<input
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="date"
						id="end-date"
						bind:value={endDate}
					/>
				</div>
			</div>
			<div>
				<label for="start-time" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Start</label
				>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
						<TimerSvg />
					</div>
					<input
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="time"
						id="start-time"
						bind:value={newEvent.start}
						required
						onchange={(e) => {
							newEvent.start = (e.target as HTMLInputElement).value;
						}}
					/>
				</div>
			</div>
			<div>
				<label for="end-time" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>End</label
				>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
						<TimerSvg />
					</div>
					<input
						class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm leading-none text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
						type="time"
						id="end-time"
						bind:value={newEvent.end}
						required
						onchange={(e) => {
							newEvent.end = (e.target as HTMLInputElement).value;
						}}
					/>
				</div>
			</div>
		</section>
		<Button onclick={saveNewEvent}>Save</Button>
	</Dialog.Content>
</Dialog.Root>
