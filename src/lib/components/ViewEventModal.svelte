<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import type { CalendarEvent } from '@schedule-x/calendar';
	import { Button } from '$lib/components/ui/button';

	type Props = {
		open: boolean;
		data: CalendarEvent | null;
		// saveAction: () => void;
	};

	let { open = $bindable(), ...props }: Props = $props();
	let startTime: string = $state('');
	let endTime: string = $state('');

	/** toggled when any input is changed */
	let changed: boolean = $state(false);

	$effect.pre(() => {
		if (props.data?.start) {
			startTime = String(props.data?.start).split(' ')[1].trim();
		}

		if (props.data?.end) {
			endTime = String(props.data?.end).split(' ')[1].trim();
		}
	});

	$effect(() => {
		console.log({ startTime });
	});
	$effect(() => {
		console.log({ endTime });
	});

	const editEvent = async () => {
		let start = String(props.data?.start).split(' ')[0].trim();
		let end = String(props.data?.end).split(' ')[0].trim();
		const response = await fetch('/api/edit-event', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: props.data?.id,
				start: `${start} ${startTime}`,
				end: `${end} ${endTime}`
			})
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
		<!-- <pre class="text-sm">{JSON.stringify(props.data, null, 2)}</pre> -->
		<section class="grid w-full grid-cols-2 gap-4">
			<div>
				<label for="start-time" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
					>Start</label
				>
				<div class="relative">
					<div class="pointer-events-none absolute inset-y-0 end-0 top-0 flex items-center pe-3.5">
						{@render timerSvg()}
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
						{@render timerSvg()}
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

{#snippet timerSvg()}
	<svg
		class="h-4 w-4 text-gray-500 dark:text-gray-400"
		aria-hidden="true"
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 24 24"
	>
		<path
			fill-rule="evenodd"
			d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
			clip-rule="evenodd"
		/>
	</svg>
{/snippet}
