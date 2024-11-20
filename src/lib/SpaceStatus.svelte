<script lang="ts">
	import spaceApiSchema from './spaceApiSchema';

	const {
		apiUrl,
		interval = 2000,
		...otherProps
	} = $props<{ apiUrl: string; interval?: number } | HTMLImageElement>();

	let imageSrc = $state('');
	let alt = $state('unknown');

	setInterval(async () => {
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
	}, interval);
</script>

<img src={imageSrc} alt={'Space status: ' + alt} {...otherProps} />
