<script>
	import {Page, Link, Block} from 'konsta/svelte';
	import Icon from "@iconify/svelte";
	import Loading from '$lib/components/custom/Loading.svelte';
	import {client, getMe} from '$lib/js/directus.js';
	import {USER} from '$lib/js/store/user.js';
	import {onMount} from 'svelte';
	import {Pincode, PincodeInput} from "svelte-pincode";
	import {toast} from 'svelte-sonner';
	import {goto} from '$app/navigation';
	import {site} from '$lib/js/store/site.js';


	let showPassword = true;
	let loading = false;
	let disabled = false;
	let email = "";
	let password = "";
	let otpPage = false;

	let ref;
	let code = [];
	let value = '';
	let complete = false;

	async function loginUser() {
		loading = true;
		try {
			const _d = await client.login(email, password);
			if(_d) {
				const _c = await getMe();
				if(_c.role === 'f0371fb2-5c10-454e-8728-b7b43e9e775f') {
					$USER = _d;
					await goto('/');
					disabled = true;
				} else {
					toast.error("You are not authorized to access this app.");
				}
			} else {
				toast.error("You are not authorized to access this app.");
			}

		} catch (error) {
			console.error(error);
			if (error.errors[0].extensions.code === 'INVALID_OTP') {
				otpPage = true;
				toast.info("OTP Required");
			} else {
				toast.error(error.errors[0].message);
			}
		} finally {
			loading = false;
		}
	}

	async function loginOTP() {
		loading = true;
		try {
			const _d = await client.login(email, password, {
				otp: value
			});
			$USER = _d;
			disabled = true;
			toast.success("Logged in successfully.");

		} catch (error) {
			console.error(error);
			toast.error(error.errors[0].message);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		if (window.location.href.includes('reset')) {
			setTimeout(() => {
				goto('/reset-password');
			}, 500)

		}
	})

</script>

<svelte:head>
	<title>Login</title>
</svelte:head>

<Page>
	<div class="bg-zinc-900 py-9 flex  w-full items-center justify-center bg-contain bg-no-repeat"
	     style="
         background: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url('/img/bg-image.webp');
         background-size: 80%;
"
	>
		<Block class="w-full">
			<p class="mb-12 flex items-center text-white font-bold text-lg">
				<img src="/img/logo.png" class="w-7" alt="logo"/>{$site.title}
			</p>
			<h1 class="text-3xl font-bold text-white mb-2">Login</h1>
			<p class="text-sm text-white">Welcome back, login to the {$site.title} app to get started.</p>
		</Block>
	</div>

	{#if !otpPage}
		<Block>
			<form on:submit|preventDefault={loginUser}>
				<div class="grid gap-4 mt-6">
					<div class="grid gap-2">
						<input type="email" bind:value={email} id="email" class="placeholder:text-base !text-lg"
						       placeholder="Email" required/>
					</div>
					<div class="grid gap-2 relative">
						<input
							on:input={(e)=>password=e.target.value}
							type={!showPassword ? 'text': 'password'}
							minlength="3"
							maxlength="20"
							id="password"
							class="placeholder:text-base !text-lg"
							placeholder="Password"
							required
						/>
						<div class="absolute inset-y-0 right-0 flex items-center pr-3"
						     on:click={()=> showPassword = !showPassword}>
							<Icon icon="heroicons:eye"
							      class="{showPassword && password !== ''  ? 'inline-block' : 'hidden'} h-6 w-6 text-black hover:cursor-pointer"/>
							<Icon icon="heroicons:eye-slash"
							      class="{showPassword  ? 'hidden' : 'inline-block'} h-6 w-6 text-black hover:cursor-pointer"/>
						</div>
					</div>
					<div class="grid gap-2">
						<button {disabled} type="submit"
						        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
							{#if loading}
								<Loading color="text-white"/>
							{:else}
								Login
							{/if}
						</button>
					</div>
				</div>
			</form>
			<div class="mt-5 flex justify-center">
				<Link href="/request" class="text-base text-primary-500 font-medium">Forgot Password
				</Link>
			</div>

		</Block>
	{:else}
		<Block>
			<form on:submit|preventDefault={loginOTP} class="relative">
				<div class="grid gap-4 mt-6">
					<Pincode type="numeric" bind:this={ref} bind:code bind:value bind:complete>
						<div class="!grid !grid-cols-6 gap-2 px-1">
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
							<div class="col-span-1">
								<PincodeInput
									class="appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pin-input !text-xl !font-bold"/>
							</div>
						</div>
					</Pincode>
					<div class="grid gap-2">
						<button {disabled} type="submit"
						        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
							{#if loading}
								<Loading color="text-white"/>
							{:else}
								Verify
							{/if}
						</button>
					</div>
				</div>
			</form>
		</Block>
	{/if}
</Page>