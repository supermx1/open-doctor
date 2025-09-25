<script>
	import {page} from '$app/stores';
	import { onMount } from 'svelte';
	import { Block, Page } from 'konsta/svelte';
	import NavBar from '$lib/components/custom/NavBar.svelte';
	import {client} from '$lib/js/directus.js';
	import Loading from '$lib/components/custom/Loading.svelte';
	import { createItem } from '@directus/sdk';
	import { DOCTOR_DATA } from '$lib/js/store/user.js';
	import { toast } from 'svelte-sonner';

	let loading = false;
	let disabled = true
	let status = "in-view";
	let diagnosis = "";
	let description = "";


	async function addMedicalRecord(){
		loading = true
		if($DOCTOR_DATA === null){
			toast.error("You are not logged in as a doctor");
			return;
		}
		try {
				const d = await client.request(createItem('medical_record', {
					appointment: [$page.params.id],
					patient: $page.url.searchParams.get('patient'),
					doctor: $DOCTOR_DATA.id,
					status,
					diagnosis,
					description
				}));
			console.log(d)
				toast.success("Medical Record Added Successfully");
		}catch (e) {
			console.log(e)
			toast.error(`An error occurred while adding the medical record: ${e.errors[0].message}`);
		}finally {
			loading = false;
		}
	}
	onMount(async () => {
		console.log($DOCTOR_DATA);
	})
</script>

<Page>
	<NavBar title="Add Medical Record" />
	<Block>
		<p>Appointment ID: {$page.params.id}</p>
		<form on:submit|preventDefault={addMedicalRecord}>
			<div class="grid grid-cols-2 gap-2 mt-6">
				<div class="col-span-2">
					<label for="lastName" class="text-sm mb-2">Status</label>
					<select class="" bind:value={status}>
						<option value="in-view">In View</option>
						<option value="closed">Close</option>
					</select>
				</div>
				<div class="col-span-2">
					<label for="description" class="text-sm mb-2">Description</label>
					<textarea bind:value={description} id="description" rows="5" class="placeholder:text-base !text-lg bg-white py-3"
					          placeholder="Enter A Brief Description" required></textarea>
				</div>
				<div class="col-span-2">
					<label for="diagnosis" class="text-sm mb-2">Diagnosis</label>
					<textarea bind:value={diagnosis} id="diagnosis" rows="5" class="placeholder:text-base !text-lg bg-white py-3"
					       placeholder="Enter A Diagnosis" required></textarea>
				</div>
				<div class="col-span-2">
					<button disabled={diagnosis === "" || status === ""} type="submit"
					        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4 disabled:opacity-80">
						{#if loading}
							<Loading color="text-white"/>
						{:else}
							Add Record
						{/if}
					</button>
				</div>
			</div>
		</form>
	</Block>
</Page>