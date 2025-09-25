<script>
	import {page} from '$app/stores';
	import { onMount } from 'svelte';
	import { Block, Page } from 'konsta/svelte';
	import NavBar from '$lib/components/custom/NavBar.svelte';
	import {client} from '$lib/js/directus.js';
	import Loading from '$lib/components/custom/Loading.svelte';
	import { DOCTOR_DATA } from '$lib/js/store/user.js';
	import { toast } from 'svelte-sonner';
	import { readItem, updateItem } from '@directus/sdk';
	import Warning from '$lib/components/custom/Warning.svelte';
	import { goto } from '$app/navigation';

	let loading = false;
	let disabled = true
	let status = "in-view";
	let diagnosis = "";
	let description = "";


	async function getMedicalRecord(){
		try {
			const d = await client.request(readItem('medical_record', Number($page.url.searchParams.get('id'))));
			console.log(d);
			status = d.status;
			diagnosis = d.diagnosis;
			description = d.description;
		}catch (e) {
			console.log(e);
		}
	}


	async function editMedicalRecord(){
		loading = true
		try {
				const d = await client.request(updateItem('medical_record', Number($page.url.searchParams.get('id')), {
					status,
					diagnosis,
				}));
			console.log(d)
				toast.success("Medical Updated Successfully");
			setTimeout(() => {
				goto(`/appointment/${$page.params.id}`);
			}, 2000);
		}catch (e) {
			console.log(e)
			toast.error(`An error occurred while adding the medical record: ${e.errors[0].message}`);
		}finally {
			loading = false;
		}
	}
	onMount(async () => {
		await getMedicalRecord();
	})
</script>

<Page>
	<NavBar title="Add Medical Record" />
	<Block>
		<form on:submit|preventDefault={editMedicalRecord}>
			<div class="grid grid-cols-2 gap-2 mt-6">
				{#if status === "closed"}
					<div class="col-span-2">
						<Warning title="Please Note"
						         message="Once submitted you will not be able to make changes."/>
					</div>
				{/if}
				<div class="col-span-2">
					<label for="lastName" class="text-sm mb-2">Status</label>
					<select class="" bind:value={status}>
						<option value="in-view">In View</option>
						<option value="closed">Close</option>
					</select>
				</div>

				<div class="col-span-2">
					<label for="description" class="text-sm mb-2">Description</label>
					<textarea bind:value={description} id="description" rows="5" class="placeholder:text-base !text-lg bg-white py-3 disabled:bg-zinc-200"
					          placeholder="Enter A Brief Description" disabled readonly></textarea>
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
							Edit Record
						{/if}
					</button>
				</div>
			</div>
		</form>
	</Block>
</Page>