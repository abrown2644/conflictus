<script lang="ts">
	import { onMount } from 'svelte';
	import { MapLibre, GeoJSON, CircleLayer, Popup, SymbolLayer } from 'svelte-maplibre';
	import * as earthquakes from '$lib/earthquakes.json';

	export let battleData;

	let clickedFeature;
	let openOn;
</script>

<svelte:head>
	<title>Conflictus</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<MapLibre
	center={[5, 20]}
	zoom={1.7}
	class="map"
	standardControls
	style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
>
	<GeoJSON
		id="earthquakes"
		data={earthquakes}
		cluster={{
			radius: 500,
			maxZoom: 14,
			properties: {
				// Sum the `mag` property from all the points in each cluster.
				total_mag: ['+', ['get', 'mag']]
			}
		}}
	>
		<CircleLayer
			applyToClusters
			hoverCursor="pointer"
			paint={{
				// Use step expressions (https://maplibre.org/maplibre-gl-js-docs/style-spec/#expressions-step)
				// with three steps to implement three types of circles:
				//   * Blue, 20px circles when point count is less than 100
				//   * Yellow, 30px circles when point count is between 100 and 750
				//   * Pink, 40px circles when point count is greater than or equal to 750
				'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
				'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
				'circle-stroke-color': '#f00',
				'circle-stroke-width': 1
				// 'circle-stroke-opacity': hoverStateFilter(0, 1)
			}}
			manageHoverState
			on:click={(e) => (clickedFeature = e.detail.features?.[0]?.properties)}
		>
			<!-- <Popup {openOn} closeOnClickInside let:features>
				<ClusterPopup feature={features?.[0]} />
			</Popup> -->
		</CircleLayer>

		<SymbolLayer
			applyToClusters
			layout={{
				'text-field': [
					'format',
					['get', 'point_count_abbreviated'],
					{},
					'\n',
					{},
					[
						'number-format',
						['/', ['get', 'total_mag'], ['get', 'point_count']],
						{
							'max-fraction-digits': 2
						}
					],
					{ 'font-scale': 0.8 }
				],
				'text-size': 12,
				'text-offset': [0, -0.1]
			}}
		/>

		<CircleLayer
			applyToClusters={false}
			hoverCursor="pointer"
			paint={{
				'circle-color': '#11b4da',
				'circle-radius': 4,
				'circle-stroke-width': 1,
				'circle-stroke-color': '#fff'
			}}
			on:click={(e) => (clickedFeature = e.detail.features?.[0]?.properties)}
		>
			<Popup {openOn} closeOnClickInside let:features>
				{@const props = features?.[0]?.properties}
				<p>
					Date: <span class="font-medium text-gray-800"
						>{new Date(props.time).toLocaleDateString()}</span
					>
				</p>
				<p>Magnitude: <span class="font-medium text-gray-800">{props.mag}</span></p>
				<p>
					Tsunami: <span class="font-medium text-gray-800">{props.tsunami ? 'Yes' : 'No'}</span>
				</p>
			</Popup>
		</CircleLayer>
	</GeoJSON>
</MapLibre>

<style>
	:global(.map) {
		height: 100vh;
	}
</style>
