<script>
	import { Tabbar,TabbarLink, } from 'konsta/svelte';
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import {page} from '$app/stores';
	import { onMount } from 'svelte';
	import { getMyDetails, getNotifications, getMe } from '$lib/js/directus.js';


	onMount(async () => {
		const d = await getMe();
		await getMyDetails(d?.id);
		await getNotifications();
	});

</script>

	<slot />
	<Tabbar
	labels
	icons
	class="left-0 bottom-0 fixed"
>
	<TabbarLink
		active={$page.url.pathname === '/'}
		onClick={() => goto('/')}
		label="Home"
	>
		<svelte:fragment slot="icon">
			<Icon icon="solar:home-smile-angle-bold-duotone" class="w-8 h-8" />
		</svelte:fragment>
	</TabbarLink>
	<TabbarLink
		active={$page.url.pathname === '/settings'}
		onClick={() => goto('/settings')}
		label="Settings"
	>
		<svelte:fragment slot="icon">
			<Icon icon="solar:settings-bold-duotone" class="w-8 h-8" />
		</svelte:fragment>
	</TabbarLink>
</Tabbar>