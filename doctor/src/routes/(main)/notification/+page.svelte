<script>
	import { Block, Link, List, ListItem, Navbar, Page, Popup } from 'konsta/svelte';
import NavBar from '$lib/components/custom/NavBar.svelte';
import { quintOut } from 'svelte/easing';
import { notifications, lastUpdated, notificationCount } from '$lib/js/store/notification.js';
import {formatDateExt, removeTags} from '$lib/js/utils2.js';
import {slide} from "svelte/transition";
	import RelativeTime from 'svelte-relative-time';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { getNotifications } from '$lib/js/directus.js';

	let notification = null;
	let loading = false;
	let notificationPopupOpened = false;

	function openNotification(index) {
		notification = $notifications[index];
		notificationPopupOpened = true;
	}
async function refreshNotifications() {
		console.log('Refreshing notifications');
		loading = true;
		// check getNotifications function resolves the promise then set loading to false
		await getNotifications();
		loading = false;

	}
	$: console.log($notifications);

</script>

<Page>
	<NavBar title="Notifications" />
			<List strongIos outlineIos>
					{#if $notifications && $notificationCount > 0}
						{#each $notifications as notification, i}
							<ListItem
								class="notification"
								onClick={()=> openNotification(i)}
								chevronMaterial={false}
								link
								title={notification.collection !== null ? `⚠️ ${notification.subject}` : notification.subject}
								after={formatDateExt(notification.timestamp)}
								subtitle={notification.subject}
								text={removeTags(notification.message)}
							/>
						{/each}

					{:else}
						<li>
							<div class="block">
								<p class="text-center">No notifications</p>
							</div>
						</li>
					{/if}
			</List>

	{#if $lastUpdated}
		<div class="flex justify-center px-3 ">
			<a on:click={refreshNotifications} class="hover:bg-zinc-300 hover:cursor-pointer text-[0.7rem] border border-zinc-100 rounded-full px-3 py-1 bg-zinc-200 flex items-center gap-1">
				{#if loading}
					<Icon icon="ph:arrows-clockwise-light"  class="animate-spin" />
				{:else}
					<Icon icon="ph:arrows-clockwise-light"  /> {/if}
				Last updated: <RelativeTime live={true} date={$lastUpdated} locale="en"/>
			</a>
		</div>
	{/if}


<!--		<div class="absolute !z-[9999] left-1/2 bottom-18 transform -translate-x-1/2 w-auto">-->
<!--			{#if $lastUpdated}-->
<!--				<a on:click={refreshNotifications} class="hover:bg-zinc-300 hover:cursor-pointer text-[0.7rem] border border-zinc-100 rounded-full px-3 py-1 bg-zinc-200 flex items-center gap-1">-->
<!--					{#if loading}-->
<!--						<Icon icon="ph:arrows-clockwise-light"  class="animate-spin" />-->
<!--					{:else}-->
<!--						<Icon icon="ph:arrows-clockwise-light"  /> {/if}-->
<!--					Last updated: <RelativeTime live={true} date={$lastUpdated} locale="en"/>-->
<!--				</a>-->
<!--			{/if}-->
<!--		</div>-->

	<Popup opened={notificationPopupOpened} onBackdropClick={() => (notificationPopupOpened = false)}>
		<Page>
			<Navbar
				transparent
				titleClass="!text-zinc-800 !opacity-100"
			>
				<Link slot="right" navbar onClick={() => (notificationPopupOpened = false)}> Close</Link>
			</Navbar>
			<Block class="space-y-4">
				{#if notification}
					<div class="block" in:slide={{ y: 200, easing: quintOut, axis: 'y', opacity: 0.5  }}>
						<p class="text-lg font-bold">
							{#if notification.collection !== null}
								⚠️
							{/if}
							{notification.subject}
						</p>
						<p class="text-xs text-muted">{formatDateExt(notification.timestamp)}</p>
						<p class="">{@html notification.message}</p>
					</div>
				{/if}
			</Block>
		</Page>
	</Popup>


</Page>


<style>
	:global(.notification .shrink.font-semibold) {
		@apply whitespace-nowrap truncate;
	}
</style>