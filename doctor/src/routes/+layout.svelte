<script>
	import '../app.css';
	import '../style.css';
	import { App } from 'konsta/svelte';
	import { Toaster } from "$lib/components/ui/sonner";
	import { toast } from 'svelte-sonner';
	import {USER} from '$lib/js/store/user.js';
	import LoadingPage from '$lib/components/custom/LoadingPage.svelte';
	import { onMount } from 'svelte';
	import { client } from '$lib/js/directus.js';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import {useOverscrollHandler} from '$lib/js/utils2.js';

	injectSpeedInsights();

	async function refreshUser() {
		try {
			$USER = await client.refresh();
			await goto($page.url.pathname || '/');
		} catch (error) {
			$USER = null;
			await goto('/login');
			console.error(error);
		}
	}

	onMount(async () => {
		await refreshUser();
		useOverscrollHandler();

	});

	async function detectServiceWorkerUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newWorker = registration.installing;
			newWorker.addEventListener('statechange', () => {
				if (newWorker.state === 'installed') {
					if (navigator.serviceWorker.controller) {
						toast('A new update is available!', {
							duration: 800000,
							action: {
								label: 'Update',
								onClick: () => {
									newWorker.postMessage({ type: 'SKIP_WAITING' });
									window.location.reload()
								} ,
							},
							description: ''
						})
					} else {
						console.log('Content is now available offline!');
					}
				}
			});
		});
	}

	onMount(async () => {
		await detectServiceWorkerUpdate();
	});

</script>

<App theme="ios">

	{#if $USER === undefined}
		<LoadingPage/>
	{:else}
		<slot/>
	{/if}

</App>

<Toaster />