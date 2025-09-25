<script>
	import { Page, Navbar, Popup, Block, Link, BlockTitle, Fab, Badge, List, ListItem } from 'konsta/svelte';
	import { onMount } from 'svelte';
	import {getMedicalRecords} from '$lib/js/directus.js';
	import Icon from '@iconify/svelte';
	import * as Accordion from "$lib/components/ui/accordion";
	import { formatDateDay, formatTime, calculateAge } from '$lib/js/utils2.js';
	import {DOCTOR_DATA} from '$lib/js/store/user.js';

	export let medicalRecordPopupOpened = false;
	export let appointment;
	let medicalRecords = [];

	onMount(async ()=>{
		medicalRecords = await getMedicalRecords();
		console.log(appointment);
	});
</script>

	<Popup bind:opened={medicalRecordPopupOpened} onBackdropClick={() => (medicalRecordPopupOpened = false)}>
		<Page>
			<Navbar
				title="Medical Records"
				transparent
				titleClass="!text-zinc-800 !opacity-100"
			>
				<Link slot="right" navbar onClick={() => (medicalRecordPopupOpened = false)}> Close</Link>
			</Navbar>
			<Block>
				<BlockTitle>{appointment?.patient?.first_name + ' ' + appointment?.patient?.last_name} - {appointment?.patient?.patient_id}</BlockTitle>
			</Block>


			<List strongIos outlineIos inset class="shadow-sm border-zinc-50">
				<ListItem title="Sex">
					<Icon slot="media" icon="icons8:gender" class="h-4 w-4" />
					<div slot="after" class="!font-medium flex items-center gap-1">
						<span class="capitalize">{appointment?.patient?.gender}</span>
					</div>
				</ListItem>
				<ListItem title=" Date of Birth">
					<Icon slot="media" icon="heroicons:calendar-date-range" class="h-4 w-4" />
					<div slot="after" class="!font-medium flex items-center gap-1">
							<span>{ appointment?.patient?.date_of_birth ? formatDateDay(appointment?.patient?.date_of_birth) + ` (` + calculateAge(appointment?.patient?.date_of_birth) + `)` : ""}</span>
					</div>
				</ListItem>
				{#if appointment?.patient?.blood_group}
					<ListItem title="Blood Group">
						<Icon slot="media" icon="hugeicons:blood" class="h-4 w-4" />
						<div slot="after" class="!font-medium flex items-center gap-1">
							<span>{appointment?.patient?.blood_group}</span>
						</div>
					</ListItem>
				{/if}

				{#if appointment?.patient?.genotype}
					<ListItem title="Genotype">
						<Icon slot="media" icon="healthicons:blood-drop-outline" class="h-4 w-4" />
						<div slot="after" class="!font-medium flex items-center gap-1">
							<span>{appointment?.patient?.genotype}</span>
						</div>
					</ListItem>
				{/if}

				{#if appointment?.patient?.height}
					<ListItem title="Height">
						<Icon slot="media" icon="healthicons:height-outline" class="h-4 w-4" />
						<div slot="after" class="!font-medium flex items-center gap-1">
							<span>{appointment?.patient?.height + `cm` || ""}</span>
						</div>
					</ListItem>
				{/if}

				{#if appointment?.patient?.weight}
					<ListItem title="Weight">
						<Icon slot="media" icon="healthicons:weight-outline" class="h-4 w-4" />
						<div slot="after" class="!font-medium flex items-center gap-1">
							<span>{appointment?.patient?.weight + `kg` || ""}</span>
						</div>
					</ListItem>
				{/if}
			</List>


			<Block>
				<BlockTitle>Records</BlockTitle>
			</Block>
			<Block class="!pb-16">
				{#each medicalRecords as record, i}
				<div class="bg-white shadow-sm rounded-lg border border-zinc-50 px-4 mb-2">
					<Accordion.Root>
						<Accordion.Item value={record.date_created} class="border-0">
							<Accordion.Trigger class="hover:no-underline">
								<div class="item-title !text-sm flex items-center gap-2 pl-1">
									<span class:!text-primary-600={ record.status === 'in-view'}>{formatDateDay(record.date_created)}</span>
									{#each record.appointment as app}
										{#if app.id === appointment?.id}
											<Badge class="bg-yellow-500 text-white">Current</Badge>
										{/if}
									{/each}
								</div>
							</Accordion.Trigger>
							<Accordion.Content>
								<div class="bg-gray-200 rounded-lg p-2 mb-2">
									<h1 class="font-medium text-lg">Patient Description</h1>
									{@html record.description}
								</div>
								<div class="bg-gray-100 rounded-lg p-2">
									<h1 class="font-medium text-lg">Diagnosis</h1>
									{#if record.doctor?.last_name}
										<p class="italic font-medium">Dr. {record.doctor?.last_name} {record.doctor?.first_name}</p>
									{/if}
									{@html record.diagnosis}
								</div>

								{#if record.doctor?.id === $DOCTOR_DATA?.id && record.status === 'in-view'}
									<Link href="{appointment?.id}/edit-medical-record?id={record.id}" class="flex items-center justify-center gap-2 text-base w-full font-medium py-4 text-primary-600">
										Edit Record
									</Link>
								{/if}
							</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
				{/each}
			</Block>
			{#if !appointment?.medical_record}
			<Fab
				href="{appointment?.id}/new-medical-record?patient={appointment?.patient?.id}"
				class="fab bg-primary-600 active:bg-primary-700  !capitalize !rounded-lg fixed left-1/2 bottom-4-safe transform -translate-x-1/2 z-20"
				text="Add Record"
				textPosition="after"
			>
<!--				<Icon icon="ph:plus" class="w-6 h-6" slot="icon" />-->
			</Fab>
				{/if}
		</Page>
	</Popup>


<style>
		:global(.fab span) {
      @apply capitalize;
		}

</style>