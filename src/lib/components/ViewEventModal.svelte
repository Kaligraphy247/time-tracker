<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import TimerSvg from './ui/svg/timerSvg.svelte';
	import type { CalendarEvent } from '@schedule-x/calendar';
	import { Button } from '$lib/components/ui/button';
	import { splitDatetime } from '$lib';

	type Props = {
		open: boolean;
		data: CalendarEvent | null;
	};

	let { open = $bindable(), ...props }: Props = $props();
	let startTime: string = $state('');
	let endTime: string = $state('');
	let title: string = $state('');

	/** toggled when any input is changed */
	let changed: boolean = $state(false);

	$effect.pre(() => {
		title = props.data?.title || '';
		if (props.data?.start) {
			startTime = splitDatetime(props.data.start).time;
		}

		if (props.data?.end) {
			endTime = splitDatetime(props.data.end).time;
		}
	});

	$effect(() => {
		console.log({ startTime }); //! DEBUG
	});
	$effect(() => {
		console.log({ endTime }); //! DEBUG
	});

	const editEvent = async () => {
		let start = splitDatetime(props.data?.start!).date;
		let end = splitDatetime(props.data?.end!).date;
		const body = {
			id: props.data?.id,
			title: title,
			start: new Date(`${start} ${startTime}`).getTime(),
			end: new Date(`${end} ${endTime}`).getTime(),
		}
		const response = await fetch('/api/edit-event', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!response.ok) {
			// const data = await response.json();
			// console.error('Error:', data.msg); //! DEBUG
			// console.error('Error:', response.statusText); //! DEBUG
			alert('Error: ' + response.statusText);
			return;
		}

		const data = await response.json();
		console.log({ data }); //! DEBUG
		alert(data.msg);
	};

	const deleteEvent = async () => {
		const confirmation = confirm('Are you sure you want to delete this event?');
		if (!confirmation) return;
		const response = await fetch(`/api/delete-event?id=${props.data?.id}`, { method: 'DELETE' });

		if (!response.ok) {
			alert('Error: ' + response.statusText);
			return;
		}

		const data = await response.json();
		alert(data.msg);
	};
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => (open = isOpen)} onOutsideClick={() => !open}>
	<Dialog.Trigger></Dialog.Trigger>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>{props.data?.title}</Dialog.Title>
			<Dialog.Description>
				{props.data?.description}
			</Dialog.Description>
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
				bind:value={title}
				oninput={(e) => {
					title = (e.target as HTMLInputElement).value;
					changed = true;
				}}
			/>
		</div>
		<section class="grid w-full grid-cols-2 gap-4">
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
						value={startTime}
						required
						onchange={(e) => {
							startTime = (e.target as HTMLInputElement).value;
							changed = true;
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
						value={endTime}
						required
						onchange={(e) => {
							endTime = (e.target as HTMLInputElement).value;
							changed = true;
						}}
					/>
				</div>
			</div>
		</section>
		<div class="flex justify-between">
			<Button variant="destructive" onclick={deleteEvent}>Delete</Button>
			<Button variant="default" disabled={!changed} onclick={editEvent}>Save</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
