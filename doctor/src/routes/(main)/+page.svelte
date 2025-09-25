<script lang="ts">
	import { Block, Link, Page, BlockTitle, Badge } from 'konsta/svelte';
	import { getAppointments } from '$lib/js/directus.js';
	import { DOCTOR_DATA } from '$lib/js/store/user.js';
	import { onMount } from 'svelte';
	import { getDayMonth, timeOfDayGreeting, calculateAge } from '$lib/js/utils2.js';
	import { notificationCount } from '$lib/js/store/notification.js';
	import Icon from '@iconify/svelte';
	import { quintOut } from 'svelte/easing';
	import { slide } from 'svelte/transition';
	import RelativeTime from 'svelte-relative-time';
	import { Device } from '@capacitor/device';


	let loading = true;
	let greeting = '';
	let appointments = [];
	let pageMessage = '';

	async function getAppointment() {
		if(!$DOCTOR_DATA?.id) return;
		try {
			appointments = await getAppointments($DOCTOR_DATA?.id, 10);
			if (appointments.length === 0) {
				pageMessage = 'You have no appointments assigned.';
			}
		} catch (error) {
			console.error('Failed to fetch appointments:', error);
		} finally {
			loading = false; // Set loading to false after fetching
		}
	}

	let style = "";

 async function deviceInfo()  {
		const info = await Device.getInfo();
		if(info.operatingSystem === 'ios') {
			style = "padding-top: 1.5rem";
		}
	}

	$: $DOCTOR_DATA?.id && getAppointment();

	onMount(async () => {
		greeting = timeOfDayGreeting();
		await deviceInfo();
	});
</script>

<Page {style}>
	<Block>
		<div class="flex justify-between mb-5">
			<div class="">
				<p class="text-sm">{greeting},</p>
				<h1 class="text-2xl font-bold capitalize">Dr. {$DOCTOR_DATA?.first_name || 'Guest'}</h1>
			</div>

			<a href="/notification" class="bg-zinc-200 rounded-full p-3 h-12 w-12 relative flex items-center justify-center">
				<Icon icon="ph:chat-teardrop-text-bold" class="absolute text-zinc-600 text-4xl" />
				<Badge class="bg-primary-600 absolute top-0 right-0">{$notificationCount}</Badge>
			</a>
		</div>
		<BlockTitle>Assigned Appointments</BlockTitle>
		<div class="mt-10">
			{#if loading}
				{#each [1, 2] as _}
					<div class="bg-white rounded-lg p-2 flex gap-4 hover:bg-zinc-50 transition mb-3">
						<div class="bg-zinc-200 animate-pulse rounded-lg h-16 w-14" ></div>
						<div>
							<div class="bg-zinc-200 animate-pulse w-12 h-4 mb-2"></div>
							<div class="bg-zinc-200 animate-pulse w-24 h-4 mb-2"></div>
							<div class="bg-zinc-200 animate-pulse w-32 h-4"></div>
						</div>
					</div>
				{/each}
			{:else }
				{#if appointments && appointments.length > 0}
					{#each appointments as appointment}
						<Link class="!inline-block !w-full !m-0 !p-0 transform transition-transform duration-300 hover:scale-[1.01]"
						      href="/appointment/{appointment.id}" key={appointment.id}>
							<div class="bg-white rounded-lg p-2 flex gap-4 hover:bg-zinc-50 transition mb-3">
								<div class="bg-primary-100 text-primary-600 rounded-lg px-4 py-1 flex flex-col justify-center text-center">
									<h1 class="text-xl">{getDayMonth(appointment.date).day}</h1>
									<p class="">{getDayMonth(appointment.date).month}</p>
								</div>
								<div>
									<h1 class="text-base font-bold">
										{#if appointment.type === 'phone'}
											Phone
										{:else if appointment.type === 'chat'}
											Chat
										{:else}
											Video
										{/if}
										Appointment</h1>
									{#if appointment.patient}
										<p class=" text-sm capitalize">{appointment.patient.gender}:
											<i>{appointment.patient.first_name} {appointment.patient.last_name} ({calculateAge(appointment.patient.date_of_birth)})</i></p>
									{/if}
									<RelativeTime class="font-semibold capitalize" date={new Date(appointment.date)} locale="en" />
								</div>
								<div class="w-auto flex-1 flex justify-end pr-2 pt-1">
									<div>

									{#if appointment.status === 'pending'}
										<Badge class="bg-yellow-500">P</Badge>
									{:else if appointment.status === 'completed'}
										<Badge class="bg-green-500">C</Badge>
									{:else}
										<Badge color="red">R</Badge>
									{/if}
									</div>
								</div>
							</div>
						</Link>
					{/each}
				{/if}
				{#if pageMessage}
					<div class="h-16 flex justify-center items-center flex-col gap-4"
					     in:slide={{ y: 200, easing: quintOut, axis: 'y', opacity: 0.5  }}>
						<p>{pageMessage}</p>
						<Link on:click={getAppointment}>
							<Icon icon="prime:refresh" class="w-8 h-8 text-primary-600" />
						</Link>
					</div>
				{/if}
			{/if}
		</div>


	</Block>


</Page>