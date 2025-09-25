<script lang="ts">
	import { page } from "$app/stores";
	import { goto } from "$app/navigation";
	import { Badge, Block, BlockTitle, Link, Page, List, ListItem, Dialog, DialogButton, } from 'konsta/svelte';
	import NavBar from '$lib/components/custom/NavBar.svelte';
	import {onMount} from 'svelte';
	import {getAppointment} from '$lib/js/directus.js';
	import {formatDateDay, formatTime} from '$lib/js/utils2.js';
	import Icon from '@iconify/svelte';
	import * as Accordion from "$lib/components/ui/accordion";
	import {client} from '$lib/js/directus.js';
	import {updateItem} from '@directus/sdk';
	import {DOCTOR_DATA} from '$lib/js/store/user';
	import a from "$lib/assets/medical_records.webp";
	import b from "$lib/assets/prescriptionss.webp";
	import MedicalRecords from './MedicalRecords.svelte';
	import { toast } from 'svelte-sonner';
	import Chat from './Chat.svelte';

	let appointment;
	let medicalRecordPopupOpened = false;
	let chatPopupOpened = false;
	let completeAppointmentDialog = false;

	async function completeAppointment(){
		try {
			const d = await client.request(updateItem('appointment', $page.params.id, {
				status: 'completed'
			}));
			toast.success("Appointment completed successfully");
			goto('/');
		}catch (e) {
			console.log(e);
			toast.error(`An error occurred while completing the appointment: ${e.errors[0].message}`);
		}
	}

	$: messageLink = `https://wa.me/%2B234${appointment?.patient?.phone}?text=Hello%20${appointment?.patient?.last_name},%20I%20am%20Dr.%20${$DOCTOR_DATA?.first_name}%20${$DOCTOR_DATA?.last_name}.%20You%20have%20an%20appointment%20with%20me%20on%20${formatDateDay(appointment?.date)}.I%20would%20like%20to%20begin%20your%20consultation`;


	onMount(async () => {
		appointment = await getAppointment($page.params.id);
	})
</script>

<Page>
	<NavBar title="Appointment" />

	{#if appointment}
		<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
			<ListItem title="Appointment Date">
				<Icon slot="media" icon="heroicons:calendar-days" class="h-4 w-4"/>
				<div slot="after" class="!font-medium flex items-center gap-1">
					<span>{formatDateDay(appointment.date)}</span>
				</div>
			</ListItem>
			<ListItem title="Appointment Time">
				<Icon slot="media" icon="heroicons:clock" class="h-4 w-4"/>
				<div slot="after" class="!font-medium flex items-center gap-1">
					{#if appointment.time}
						<span>{formatTime(appointment?.time)}</span>
					{/if}
				</div>
			</ListItem>
			<ListItem title="Type">
				<Icon slot="media" icon="heroicons:arrows-up-down" class="h-4 w-4"/>
				<div slot="after" class="!font-medium flex items-center gap-1">
					{#if appointment.type === 'phone'}
						<Badge class="px-2 bg-purple-800">Phone Call</Badge>
					{:else if appointment.type === 'video'}
						<Badge class="px-2 bg-blue-800">Video Call</Badge>
					{:else}
						<Badge class="px-2 bg-orange-600">Chat</Badge>
					{/if}
				</div>
			</ListItem>
		</List>
	<Block>
		<div class="bg-white shadow-sm rounded-lg border border-zinc-50 px-4 mb-5">
			<Accordion.Root>
				<Accordion.Item value="item-1" class="border-0">
					<Accordion.Trigger>
						<div class="item-title !text-sm flex items-center gap-2 pl-1">
							<span class="relative flex h-3 w-3 overflow-visible">
								<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 "></span>
								<span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
							</span>
							<span>Reason</span>
					</Accordion.Trigger>
					<Accordion.Content>
						{@html appointment.description}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</div>
		{#if new Date(appointment.date) >= new Date()}

			{#if appointment.type === 'phone' && appointment?.patient?.phone}
				<Link target="_blank" href="tel:{appointment?.patient?.phone}" class="flex items-center justify-center gap-2 text-base w-full bg-purple-800 text-white font-medium rounded-lg py-4">
					<Icon icon="heroicons:phone-arrow-up-right-20-solid"   />
					Call Patient
				</Link>
			{/if}
			{#if appointment.type === 'chat'}
				<Link onClick={()=> chatPopupOpened = true} class="flex items-center justify-center gap-2 text-base w-full bg-orange-600 text-white font-medium rounded-lg py-4">
					<Icon icon="heroicons:chat-bubble-left-right" />
					Chat with Patient
				</Link>
			{/if}
			{#if appointment.type === 'video' && appointment?.patient?.phone}
				<Link target="_blank" href={messageLink} class="flex items-center justify-center gap-2 text-base w-full bg-blue-800 text-white font-medium rounded-lg py-4">
					<Icon icon="heroicons:video-camera"  />
					Video Call Patient
				</Link>
			{/if}

		{/if}

		</Block>

		<Block>
			<BlockTitle>Manage Patient</BlockTitle>
		</Block>
			<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
				<ListItem title="Medical Records" link onClick={()=> medicalRecordPopupOpened = true}>
					<img slot="media" src={a} alt="Medical Records" class="h-6 w-6"/>
				</ListItem>
				<ListItem title="Prescriptions" link>
					<img slot="media" src={b} alt="Prescriptions" class="h-6 w-6"/>
				</ListItem>
			</List>

		{#if new Date(appointment.date) <= new Date()}
		<Block>
			<Link onClick={()=> completeAppointmentDialog = true} class="flex items-center justify-center gap-2 text-base w-full font-medium py-4 text-primary-600">Complete Appointment</Link>
		</Block>
		{/if}
	{:else}
		<Block>
			<div class="bg-white rounded-lg p-2 flex flex-col gap-4 hover:bg-zinc-50 transition mb-5 list list-strong-ios list-dividers-ios inset shadow-sm">
				<div class="bg-zinc-200 animate-pulse w-48 h-4 mb-2"></div>
				<div class="bg-zinc-200 animate-pulse w-48 h-4 mb-2"></div>
				<div class="bg-zinc-200 animate-pulse w-32 h-4"></div>
			</div>

			<div class="bg-white rounded-lg p-2 flex flex-col gap-4 hover:bg-zinc-50 transition mb-5 list list-strong-ios list-dividers-ios inset shadow-sm">
				<div class="bg-zinc-200 animate-pulse w-48 h-4 mb-2"></div>
			</div>

			<div class="bg-white rounded-lg p-2 flex flex-col gap-4 hover:bg-zinc-50 transition mb-3 list list-strong-ios list-dividers-ios inset shadow-sm">
				<div class="bg-zinc-200 animate-pulse w-48 h-4 mb-2"></div>
				<div class="bg-zinc-200 animate-pulse w-48 h-4 mb-2"></div>
			</div>
		</Block>
	{/if}

	{#if medicalRecordPopupOpened}
	<MedicalRecords bind:medicalRecordPopupOpened {appointment} />
	{/if}


	{#if appointment}
		<Chat bind:chatPopupOpened bind:appointment />
	{/if}



	<Dialog opened={completeAppointmentDialog} onBackdropClick={() => (completeAppointmentDialog = false)}>
		<svelte:fragment slot="title">Complete Appointment</svelte:fragment>
		Are you sure you want to complete and close this appointment?
		<svelte:fragment slot="buttons">
			<DialogButton onClick={() => (completeAppointmentDialog = false)}>Cancel</DialogButton>
			<DialogButton onClick={completeAppointment}>Ok</DialogButton>
		</svelte:fragment>
	</Dialog>

</Page>