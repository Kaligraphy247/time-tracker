<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';

	type Props = {
		selectedDateTime: string;
		open: boolean;
		saveAction: () => void;
	};

	let { open = $bindable(), ...props }: Props = $props();
</script>

<Dialog.Root bind:open onOpenChange={(isOpen) => (open = isOpen)} onOutsideClick={() => !open}>
	<Dialog.Trigger></Dialog.Trigger>
	<Dialog.Content class="">
		<Dialog.Header>
			<Dialog.Title>Add your working time</Dialog.Title>
			<Dialog.Description>
				This action cannot be undone. This will permanently delete your account and remove your data
				from our servers.
			</Dialog.Description>
		</Dialog.Header>
		<h1>Content</h1>
		<p>Selected Datetime: {props.selectedDateTime}</p>
		<button onclick={props.saveAction}>Save</button>
	</Dialog.Content>
</Dialog.Root>
