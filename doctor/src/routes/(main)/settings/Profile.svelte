<script>
	import { Block, BlockTitle, Dialog, DialogButton, Link, Navbar, Page, Popup } from 'konsta/svelte';
	import {DOCTOR_DATA} from '$lib/js/store/user.js';
	import Icon from '@iconify/svelte';
	import Loading from '$lib/components/custom/Loading.svelte';
	import { updateProfile } from '$lib/js/directus.js';

	export let profilePopupOpened = false;

	let loading = false;
	let disabled = false;
	let firstName = "";
	let lastName = "";
	let email = "";
	let phone = "";

	let updateProfileDialog = false;

	function pushData() {
		firstName = $DOCTOR_DATA?.first_name || "";
		lastName = $DOCTOR_DATA?.last_name || "";
		email = $DOCTOR_DATA?.email || "";
		phone = $DOCTOR_DATA?.phone || "";
	}

	$: $DOCTOR_DATA?.email && pushData();

	async function updateMyProfile() {
		loading = true;
		await updateProfile($DOCTOR_DATA.id,{first_name: firstName, last_name: lastName, phone});
		profilePopupOpened = false;
		updateProfileDialog = false;
		loading = false;
	}

</script>


	<Popup bind:opened={profilePopupOpened} onBackdropClick={() => (profilePopupOpened = false)}>
		<Page>
			<Navbar
				title="Profile"
				transparent
				titleClass="!text-zinc-800 !opacity-100"
			>
				<Link slot="right" navbar onClick={() => (profilePopupOpened = false)}> Close</Link>
			</Navbar>
			<Block>
				<form on:submit|preventDefault={()=> updateProfileDialog = true}>
					<div class="grid grid-cols-2 gap-2 mt-6">
						<div class="col-span-2">
							<label for="lastName" class="text-sm mb-2 ">Last Name</label>
							<input type="text" bind:value={lastName} id="lastName" class="placeholder:text-base !text-lg"
							       placeholder="Enter Your Last Name" required/>
						</div>
						<div class="col-span-2">
							<label for="firstName" class="text-sm mb-2 ">First Name</label>
							<input type="text" bind:value={firstName} id="firstName" class="placeholder:text-base !text-lg"
							       placeholder="Enter Your First Name" required/>
						</div>
						<div class="col-span-2">
							<label for="phone" class="text-sm mb-2 ">Phone (WhatsApp)</label>
							<input type="tel" bind:value={phone} id="phone" class="placeholder:text-base !text-lg"
							       placeholder="Enter Your Phone Number" minlength="11" required/>
						</div>

						<div class="col-span-2">
							<button type="button" on:click={()=> alert("Your registered email. If you want to change this email, please contact us")} class="text-sm mb-2 flex items-center gap-1">
								Email
								<Icon icon="heroicons:information-circle" class="icon-tooltip w-4 h-4 text-primary-600"/>
							</button>
							<p class="font-bold text-lg">{email}</p>
						</div>

						<div class="col-span-2">
							<button {disabled} type="submit"
							        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
								{#if loading}
									<Loading color="text-white"/>
								{:else}
									Update
								{/if}
							</button>
						</div>
					</div>
				</form>
			</Block>

			<Dialog opened={updateProfileDialog} onBackdropClick={() => (updateProfileDialog = false)}>
				<svelte:fragment slot="title">Update Profile</svelte:fragment>
				Are you sure you want to update your profile?
				<svelte:fragment slot="buttons">
					<DialogButton onClick={() => (updateProfileDialog = false)}>Cancel</DialogButton>
					<DialogButton onClick={updateMyProfile}>Ok</DialogButton>
				</svelte:fragment>
			</Dialog>


		</Page>
	</Popup>
