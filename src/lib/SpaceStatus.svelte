<script lang="ts">
	import spaceApiSchema from './spaceApiSchema';
	import { onMount } from 'svelte';

	const {
		apiUrl,
		interval = 60_000,
		...otherProps
	} = $props<{ apiUrl: string; interval?: number } | HTMLImageElement>();

	let imageSrc = $state('');
	let alt = $state('unknown');

	async function refreshState() {
		try {
			const apiResponse = await fetch(apiUrl);
			if (!apiResponse.ok) {
				throw new Error(`Response status: ${apiResponse.status}`);
			}

			const json = await apiResponse.json();
			const spaceApi = spaceApiSchema.parse(json);

			if (spaceApi.state.open) {
				imageSrc = spaceApi.state.icon.open;
				alt = 'open';
			} else {
				imageSrc = spaceApi.state.icon.closed;
				alt = 'closed';
			}
		} catch (error) {
			console.error(error);
			alt = 'Unknown';
		}
	}

	onMount(() => {
		refreshState();

		let handle = setInterval(refreshState, interval);
		return () => clearInterval(handle);
	});
</script>

<img src={imageSrc} alt={'Space status: ' + alt} {...otherProps} />
