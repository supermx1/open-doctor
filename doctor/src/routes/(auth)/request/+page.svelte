<script>
	import {  Page, Link, Block, } from "konsta/svelte"
	import Icon from "@iconify/svelte";
	import Loading from "$lib/components/custom/Loading.svelte"
	import { passwordRequest } from '@directus/sdk';
	import {client} from "$lib/js/directus";
	import { USER } from "$lib/js/store/user";
	import {toast} from 'svelte-sonner';
	import {site} from '$lib/js/store/site.js';


	let loading = false;
	let disabled = false;
	let email = "";

	async function requestResetPassword() {
		loading = true;
		try {
			const c = await client.request(passwordRequest(email, `${$site.url}/reset`));
			console.log(c);
			toast.success("Password reset link sent to your email")
			loading = false;
		} catch (error) {
			console.error(error);
			toast.error(error.errors[0].message)
			loading = false;
		}
	}

</script>

<svelte:head>
	<title>{$site.title} - Forgot Password</title>
</svelte:head>

<Page>
	<div class="bg-zinc-900 py-9 flex w-full items-center justify-center bg-contain bg-no-repeat"
	     style="
         background: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url('/img/bg-image.webp');
         background-size: 80%;
"
	>
		<Block class="w-full">
			<p class="mb-12 flex items-center text-white font-bold text-lg">
				<img src="/img/logo.png" class="w-7" alt="logo"/>{$site.title}
			</p>
			<h1 class="text-3xl font-bold text-white mb-2">Reset Password</h1>
			<p class="text-sm text-white">Forgot your password? You can reset it.</p>
		</Block>
	</div>
	<Block>

		<form on:submit|preventDefault={requestResetPassword}>
			<div class="grid gap-4 mt-6">
				<div class="grid gap-2">
					<input type="email" bind:value={email} id="email" class="placeholder:text-base !text-lg" placeholder="Email" required />
				</div>
				<div class="grid gap-2">
					<button type="submit" class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
						{#if loading}
							<Loading color="text-white"/>
						{:else}
							Reset Password
						{/if}
					</button>
				</div>
			</div>
		</form>

	</Block>
	<div class="absolute !z-[9999] left-1/2 bottom-8 transform -translate-x-1/2 w-auto">
		<a class="relative z-10 flex items-center justify-center overflow-hidden text-gray-800 hover:text-blue-600">
			<div class="box-border px-4 py-4 text-sm font-normal leading-3">
				<p class="whitespace-nowrap text-sm text-zinc-500">Already have an account? <Link href="/login" class="text-primary-500">Login</Link></p>
			</div>
		</a>
	</div>
</Page>