<script>

	import { Block, BlockTitle, List, ListItem, Page } from 'konsta/svelte';
	import { DOCTOR_DATA } from '$lib/js/store/user.js';
	import Icon from '@iconify/svelte';
	import { site } from '$lib/js/store/site.js';
	import NavBar from '$lib/components/custom/NavBar.svelte';
	import { formatDateDay, generateSVGAvatar } from '$lib/js/utils2.js';
	import { logout } from '$lib/js/directus.js';
	import Profile from './Profile.svelte';

	let profilePopupOpened = false;

</script>

<Page>
	<NavBar title="Settings" />
	<Block>
		<div class="flex items-center gap-3">
			<div class="h-[3rem] w-[3rem] rounded-full bg-gray-300 overflow-hidden justify-end"
			>
				{#if $DOCTOR_DATA?.first_name && $DOCTOR_DATA?.last_name}
					<img src={generateSVGAvatar($DOCTOR_DATA?.last_name + " " + $DOCTOR_DATA?.first_name)} alt="">
				{:else}
					<img src={generateSVGAvatar("Guest")} alt="">

				{/if}
			</div>

			<div>
				<h1 class="text-2xl font-bold -mb-2">
					Dr. {$DOCTOR_DATA?.last_name ?? "Guest"} {$DOCTOR_DATA?.first_name}
				</h1>
			</div>

		</div>
	</Block>
	<BlockTitle class="!font-bold text-black z-50">Profile</BlockTitle>
	<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
		<ListItem onClick={()=> profilePopupOpened = true} title="Manage Your Profile" link>
			<Icon slot="media" icon="heroicons:user" class="h-4 w-4" />
		</ListItem>
	</List>

	<BlockTitle class="!font-bold">Support</BlockTitle>
	<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
		<ListItem title="Contact Support" link href="https://tawk.to/chat/66de364250c10f7a00a5f9d4/1i7a0i0gd">
			<Icon slot="media" icon="streamline:customer-support-1" class="h-4 w-4" />
		</ListItem>
	</List>

	<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
		<ListItem title="Log Out" link onClick={logout} innerClass="text-primary-600">
			<Icon slot="media" icon="heroicons:arrow-left-end-on-rectangle-solid" class="h-4 w-4 text-primary-600" />
		</ListItem>
	</List>

	<div class="flex items-center justify-center mt-12 italic">
		v{$site.version}
	</div>

	<Profile bind:profilePopupOpened />
</Page>