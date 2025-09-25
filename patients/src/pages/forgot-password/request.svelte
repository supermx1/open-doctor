<script>
    import { f7, Page, Navbar, NavLeft, NavTitle, NavTitleLarge, NavRight, Link, Toolbar, Block, BlockTitle, List, ListItem, Button } from 'framework7-svelte';
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import { passwordRequest } from '@directus/sdk';
    import {client} from "@/js/directus";
    import { USER } from "@/js/store/user";
    import { site } from "@/js/store/site";



    let loading = false;
    let disabled = false;
    let email = "";

    async function requestResetPassword() {
        loading = true;
        try {
            const c = await client.request(passwordRequest(email, `${window.location.origin}/reset`));
            console.log(c);
            f7.toast.create({
                text: "Password reset link sent to your email",
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-blue",
            }).open();
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