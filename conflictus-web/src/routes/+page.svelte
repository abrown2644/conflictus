<script lang="ts">
	import Leaflet from '$lib/components/Leaflet.svelte';
	import type { LatLngExpression } from 'leaflet';
	import { createScene } from '$lib/globe-scene';
	import { onMount } from 'svelte';
	import Globe from '$lib/components/Globe.svelte';
	export let data;
</script>

<svelte:head>
	<title>Conflictus</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<!-- <Leaflet view={initialView} zoom={3} /> -->
<Globe />

<style>
	.map-wrap {
		width: 100vw;
		height: 100vh;
	}
</style>
