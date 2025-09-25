<script type="module">
    import {
        Page,
        Navbar,
        NavRight,
        Link,
        Block,
        List,
        ListItem,
        Toggle,
        Sheet,
        PageContent,
        Popup,
        f7, Toolbar, NavTitle, NavTitleLarge
    } from 'framework7-svelte';
    import QRCode from 'qrcode';
    import { USER, ME } from "@/js/store/user";
    import { client } from "@/js/directus";
    import { onMount } from "svelte";
    import { disableTwoFactor, enableTwoFactor, generateTwoFactorSecret, readMe } from "@directus/sdk";
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import NavBar from "@/components/NavBar.svelte";

    async function logout() {
        await client.logout();
        sessionStorage.removeItem('opendoctor');
        $USER = null;
    }

    onMount(async () => {
        $ME = await client.request(readMe({ fields: ['*'] }));
    });

    $: twoFactor = $ME?.tfa_secret ? true : false;

    let password = "";
    let showPassword = true;
    let disabled = false;
    let disable2FAToggle = false;
    let loading = false;
    let firstLoad = true;

    $: console.log(firstLoad);

    let secret = {};
    let qrcode = "";
    let secretCode = "";

    // Generate 2FA secret
    async function generateSecret() {
        loading = true;
        try {
            secret = await client.request(generateTwoFactorSecret(password));
            if (secret.otpauth_url) {
                await generateQRCode();
            }
            f7.sheet.close('.enter-password');
            f7.popup.open('.showQRCode');
            loading = false;
        } catch (error) {
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
            loading = false;
        }
    }

    // Generate QR Code
    async function generateQRCode() {
        qrcode = await QRCode.toString(secret.otpauth_url, {
            errorCorrectionLevel: 'H',
            type: 'svg',
            margin: 1,
            color: {}
        });
    }

    // Enable 2FA
    async function enable2FA() {
        try {
            const r = await client.request(enableTwoFactor(secret.secret, secretCode));
            if (r) {
                f7.popup.close('.showQRCode');
                f7.toast.create({
                    text: "2FA enabled successfully",
                    position: "bottom",
                    closeTimeout: 5000,
                    cssClass: "bg-blue",
                }).open();
                secretCode = "";
                twoFactor = true;
            }
        } catch (error) {
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
        }
    }

    // Disable 2FA
    async function disable2FA() {
        loading = true;
        try {
            const r = await client.request(disableTwoFactor(secretCode));
            if (r) {
                f7.toast.create({
                    text: "2FA disabled successfully",
                    position: "bottom",
                    closeTimeout: 5000,
                    cssClass: "bg-blue",
                }).open();
                f7.sheet.close('.enter-2facode');
                twoFactor = false;
                loading = false;
            }
        } catch (error) {
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
            loading = false;
        }
    }

    // Open 2FA sheet (Show password or 2FA code sheet)
    function openSheet() {
        if (firstLoad) {
            firstLoad = false;
            return;
        }
        if (!twoFactor && !$ME?.tfa_secret) {
            f7.sheet.open('.enter-password');
        } else if (twoFactor) {
            f7.sheet.open('.enter-2facode');
        }
    }

</script>

<Page name="home">
    <NavBar title="2 Factor Authentication"/>
    <List simpleList strong outlineIos dividersIos>
        <ListItem>
            <span>{twoFactor ? 'Disable' : 'Enable'} 2FA</span>
            <Toggle disabled={disable2FAToggle} bind:checked={twoFactor} on:change={openSheet}/>
        </ListItem>
    </List>

    <Sheet class="enter-password" onSheetClose={() => disable2FAToggle = false} onSheetOpen={() => disable2FAToggle = true}>
        <div class="flex justify-end -mb-6 mt-2 mr-2">
            <Link on:click={()=> f7.sheet.close('.enter-password')}>
                <Icon icon="heroicons:x-mark" class="h-6 w-6 text-zinc-800"/>
            </Link>
        </div>
        <PageContent>
            <Block>
                <form on:submit|preventDefault={generateSecret}>
                    <div class="grid gap-4 mt-6">

                        <div class="grid gap-2 relative">
                            <label for="password">Enter your password to enable 2FA</label>
                            <input
                                    on:input={(e) => password = e.target.value}
                                    type={!showPassword ? 'text' : 'password'}
                                    minlength="3"
                                    maxlength="20"
                                    id="password"
                                    class="placeholder:text-base !text-lg"
                                    placeholder="Enter Your Password"
                                    required
                            />
                            <div class="absolute inset-y-0 right-0 top-8 flex items-center pr-3"
                                 on:click={() => showPassword = !showPassword}>
                                <Icon icon="heroicons:eye"
                                      class="{showPassword && password !== '' ? 'inline-block' : 'hidden'} h-6 w-6 text-black hover:cursor-pointer"/>
                                <Icon icon="heroicons:eye-slash"
                                      class="{showPassword ? 'hidden' : 'inline-block'} h-6 w-6 text-black hover:cursor-pointer"/>
                            </div>
                        </div>
                        <div class="grid gap-2">
                            <button type="submit"
                                    class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                                {#if loading}
                                    <Loading color="text-white"/>
                                {:else}
                                    Continue
                                {/if}
                            </button>
                        </div>
                    </div>
                </form>
            </Block>
        </PageContent>
    </Sheet>

    <Popup class="showQRCode" swipeHandler=".swipe-handler">
        <Navbar title={twoFactor ? 'Enable 2FA' : 'Disable 2FA'} class="custom-navbar print:hidden">
            <NavRight>
                <Link popupClose>
                    <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6 text-zinc-800"/>
                </Link>
            </NavRight>
        </Navbar>
        <PageContent>
            <Block>
                <Block class="mb-0">
                    <div class="m-auto w-full h-full mb-3 rounded-lg border border-gray-100 ">
                        {@html qrcode}
                    </div>
                    <p class="text-center text-sm ">Secret: <span
                            class="font-mono font-medium tracking-wider">{secret.secret}</span></p>
                    <form on:submit|preventDefault={enable2FA}>
                        <div class="grid gap-4 mt-6">
                            <div class="grid gap-2">
                                <input type="tel" min="6" max="6" bind:value={secretCode} id="secretCode"
                                       class="placeholder:text-base !text-lg" placeholder="Enter 6 Digit Code" required/>
                            </div>
                            <div class="grid gap-2">
                                <button {disabled} type="submit"
                                        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                                    {#if loading}
                                        <Loading color="text-white"/>
                                    {:else}
                                        Confirm
                                    {/if}
                                </button>
                            </div>
                        </div>
                    </form>
                </Block>
            </Block>
        </PageContent>
    </Popup>

    <Sheet class="enter-2facode" onSheetClose={() => disable2FAToggle = false} onSheetOpen={() => disable2FAToggle = true}>
        <Toolbar>
            <div class="left">Enter 6 digit code to disable 2FA</div>
            <div class="right">
                <Link sheetClose>
                    <Icon icon="heroicons:x-mark" class="h-8 w-8 text-zinc-400"/>
                </Link>
            </div>
        </Toolbar>
        <PageContent>
            <Block>
                <form on:submit|preventDefault={disable2FA}>
                    <div class="grid gap-4 mt-6">
                        <div class="grid gap-2">
                            <input type="tel" min="6" max="6" bind:value={secretCode} id="secretCode"
                                   class="placeholder:text-base !text-lg" placeholder="Enter 6 Digit Code" required/>
                        </div>
                        <div class="grid gap-2">
                            <button type="submit"
                                    class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                                {#if loading}
                                    <Loading color="text-white"/>
                                {:else}
                                    Continue
                                {/if}
                            </button>
                        </div>
                    </div>
                </form>
            </Block>
        </PageContent>
    </Sheet>
</Page>

