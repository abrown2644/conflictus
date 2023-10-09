<script lang="ts">
	import { onMount } from 'svelte';
	import * as Scene from '$lib/globe-scene';

	let canvas: HTMLCanvasElement;

	onMount(() => {
		Scene.createScene(canvas);
	});
</script>

<canvas class="globe" bind:this={canvas}>
	{#if canvas}
		<slot />
	{/if}
</canvas>

<style>
	canvas {
		height: 100%;
		width: 100%;
		cursor: grab;
	}
</style>
