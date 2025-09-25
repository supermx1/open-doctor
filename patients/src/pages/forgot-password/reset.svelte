<script>
    import { f7, Page, Navbar, NavLeft, NavTitle, NavTitleLarge, NavRight, Link, Toolbar, Block, BlockTitle, List, ListItem, Button } from 'framework7-svelte';
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import { passwordReset } from '@directus/sdk';
    import {client} from "@/js/directus";
    import { utils } from "framework7/lite-bundle";
    import { site } from "@/js/store/site";

    const { token } = utils.parseUrlQuery(window.location.href);
    console.log('Query:', token);

    let showPassword = true;
    let loading = false;
    let disabled = false;
    let newPassword = "";

    export let f7router;
    export let f7route;

    async function resetPassword() {
        loading = true;
        try {
            const c = await client.request(passwordReset(token, newPassword));
            console.log(c);
            f7.toast.create({
                text: "Password reset successfully.",
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-blue",
            }).open();
            window.history.pushState({}, document.title, "/");
            f7router.navigate('/login');
            loading = false;
        } catch (error) {
            console.error(error);
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
            loading = false;
        }
    }

</script>

<svelte:head>
    <title>{$site.title} - Forgot Password</title>
</svelte:head>

<Page name="auth">
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

            <form on:submit|preventDefault={resetPassword}>
                <div class="grid gap-4 mt-6">
                    <div class="grid gap-2 relative">
                        <input
                                on:input={(e)=>newPassword=e.target.value}
                                type={!showPassword ? 'text': 'password'}
                                minlength="3"
                                maxlength="20"
                                id="password"
                                class="placeholder:text-base !text-lg"
                                placeholder="New Password"
                                required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3" on:click={()=> showPassword = !showPassword}>
                            <Icon icon="heroicons:eye" class="{showPassword && newPassword !== ''  ? 'inline-block' : 'hidden'} h-6 w-6 text-black hover:cursor-pointer" />
                            <Icon icon="heroicons:eye-slash" class="{showPassword  ? 'hidden' : 'inline-block'} h-6 w-6 text-black hover:cursor-pointer"/>
                        </div>
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