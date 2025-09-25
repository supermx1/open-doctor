<script>
    import {
        f7,
        Page,
        Link,
        Block,
    } from 'framework7-svelte';
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import {client, getMe} from "@/js/directus";
    import {USER} from "@/js/store/user";
    import {onMount} from "svelte";
    import {Pincode, PincodeInput} from "svelte-pincode";
    import {requestPermission} from "@/js/firebase";


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
                if(_c.role === '6cee8303-03fe-43a6-832d-cf4375760b04') {
                    $USER = _d;
                    disabled = true;
                    f7.toast.create({
                        text: "Logged in successfully.",
                        position: "bottom",
                        closeTimeout: 2000,
                        cssClass: "bg-blue",
                    }).open();
                } else {
                    f7.toast.create({
                        text: "You are not authorized to access this app.",
                        position: "bottom",
                        closeTimeout: 2000,
                        cssClass: "bg-red",
                    }).open();
                }
                await requestPermission();
            }
        } catch (error) {
            if (error.errors[0].extensions.code === 'INVALID_OTP') {
                otpPage = true;
                f7.toast.create({
                    text: "OTP Required",
                    position: "bottom",
                    closeTimeout: 3000,
                    cssClass: "bg-blue",
                }).open();
            } else {
                f7.toast.create({
                    text: error.errors[0].message,
                    position: "bottom",
                    closeTimeout: 2000,
                    cssClass: "bg-red",
                }).open();
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
            f7.toast.create({
                text: "Logged in successfully.",
                position: "bottom",
                closeTimeout: 2000,
                cssClass: "bg-blue",
            }).open();
        } catch (error) {
            console.error(error);
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 2000,
                cssClass: "bg-red",
            }).open();
        } finally {
            loading = false;
        }
    }


    export let f7router;
    export let f7route;
    onMount(() => {
        if (window.location.href.includes('reset')) {
            setTimeout(() => {
                f7router.navigate('/reset-password');
            }, 500)

        }
    })
</script>

<Page name="login">
    <div class="bg-zinc-900 py-9 flex  w-full items-center justify-center bg-contain bg-no-repeat"
         style="
         background: linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.8)), url('/img/bg-image.webp');
         background-size: 80%;
"
    >
        <Block class="w-full">
            <p class="mb-12 flex items-center text-white font-bold text-lg">
                <img src="/img/logo.png" class="w-7" alt="logo"/>Sandsclinic
            </p>
            <h1 class="text-3xl font-bold text-white mb-2">Login</h1>
            <p class="text-sm text-white">Welcome back, login to the Sandsclinic app to get started.</p>
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
                <Link href="/request-forget-password" class="text-base text-primary-500 font-medium">Forgot Password
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
    <div class="absolute !z-[9999] left-1/2 bottom-8 transform -translate-x-1/2 w-auto">
        <a class="relative z-10 flex items-center justify-center overflow-hidden text-gray-800 hover:text-blue-600">
            <div class="box-border px-4 py-4 text-sm font-normal leading-3">
                <p class="whitespace-nowrap text-sm text-zinc-500">Don't have an account?
                    <Link href="/register" class="text-primary-500 font-medium">Register</Link>
                </p>
            </div>
        </a>
    </div>
</Page>