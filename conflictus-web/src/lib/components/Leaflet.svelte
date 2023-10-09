<script lang="ts">
	import { onMount, onDestroy, setContext, createEventDispatcher } from 'svelte';
	import L from 'leaflet';
	// import glify from '@khiemntu/leaflet.glify';
	import 'leaflet/dist/leaflet.css';
	import * as json from '$lib/geo.json';

	export let bounds: L.LatLngBoundsExpression | undefined = undefined;
	export let view: L.LatLngExpression | undefined = undefined;
	export let zoom: number | undefined = undefined;

	const dispatch = createEventDispatcher();

	let map: L.Map | undefined;
	let mapElement: HTMLDivElement;

	onMount(() => {
		if (!bounds && (!view || !zoom)) {
			throw new Error('Must set either bounds, or view and zoom.');
		}

		map = L.map(mapElement)
			// example to expose map events to parent components:
			.on('zoom', (e) => dispatch('zoom', e));

		L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
			subdomains: 'abcd'
		}).addTo(map);

		// glify.points({
		// 	map,
		// 	data: json
		// 	// click: (e, pointOrGeoJsonFeature, xy): boolean | void => {
		// 	//     // do something when a point is clicked
		// 	//     // return false to continue traversing
		// 	// },
		// 	// hover: (e, pointOrGeoJsonFeature, xy): boolean | void => {
		// 	//     // do something when a point is hovered
		// 	// }
		// });
	});

	onDestroy(() => {
		map?.remove();
		map = undefined;
	});

	setContext('map', {
		getMap: () => map
	});

	$: if (map) {
		if (bounds) {
			map.fitBounds(bounds);
		} else if (view && zoom) {
			map.setView(view, zoom);
		}
	}
</script>

<div class="mapbody" bind:this={mapElement}>
	{#if map}
		<slot />
	{/if}
</div>

<style>
	.mapbody {
		position: absolute;
		height: 100%;
		width: 100%;
	}

	/*
	.map {		
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	} */
</style>
