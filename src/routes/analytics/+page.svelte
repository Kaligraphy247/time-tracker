<script lang="ts">
	import { getElapsedTime, getHours, getMinutes, splitDatetime } from '$lib';

	// States
	const { data } = $props();
	const analytics = $state(
		data.events.map((event) => {
			const { hours, minutes, totalTime } = getElapsedTime(event.start, event.end!);
			return {
				...event,
				hours,
				minutes,
				totalTime
			};
		})
	);
	const totalTime = $derived.by(() => {
		return analytics.length === 0
			? 0
			: analytics.map((event) => event.totalTime).reduce((a, b) => a + b);
	});
</script>

<h1 class="text-center text-4xl font-bold">Analytics</h1>

<div class="mx-auto flex justify-center space-x-4">
	<p class="text-3xl font-bold">{getHours(totalTime)}h</p>
	<p class="text-3xl font-bold">{getMinutes(totalTime)}m</p>
</div>
<ul class="space-y-4">
	{#if analytics.length !== 0}
		{#each analytics as event}
			<li class="max-w-md rounded-xl border-0 py-4">
				<div>
					<p class="text-2xl font-semibold">{event.title} <span class="text-sm font-medium">{splitDatetime(event.start).date}</span></p>
					<div class="flex justify-start space-x-4 font-sans text-xl font-semibold">
						<p>{event.hours}h</p>
						<p>{event.minutes}m</p>
					</div>
					<p class="font-mono text-xs">
						created at: {event.createdAt ? new Date(event.createdAt * 1000).toLocaleString() : ''}
					</p>
				</div>
			</li>
		{/each}
	{/if}
</ul>
