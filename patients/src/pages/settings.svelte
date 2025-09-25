<script>
    import {Block, BlockTitle, f7, Link, Page} from "framework7-svelte";
    import {client} from "@/js/directus";
    import {PATIENT_DATA, USER} from "@/js/store/user";
    import {copy, generateSVGAvatar} from "@/js/utils";
    import Icon from "@iconify/svelte";
    import {version} from "@/js/store/site";
    import Profile from "@/components/Profile.svelte";
    import NavBar from "@/components/NavBar.svelte";

    async function logout() {
        await client.logout();
        sessionStorage.removeItem('opendoctor');
        $USER = null;
    }

</script>
<Page name="Settings">
<!--    <NavBar />-->
    <Block>
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-2xl font-bold">
                    {$PATIENT_DATA?.last_name}<br/>
                    {$PATIENT_DATA?.first_name}
                </h1>
                {#if $PATIENT_DATA?.patient_id}
                    <p class="text-muted text-sm font font-medium">Patient ID: <span on:click={()=> copy($PATIENT_DATA?.patient_id, "Patient ID copied")} class="text-primary-600">{$PATIENT_DATA?.patient_id}</span></p>
                {/if}
            </div>
            <div class="h-[3rem] w-[3rem] rounded-full bg-gray-300 overflow-hidden justify-end"
            >
                {#if $PATIENT_DATA?.first_name && $PATIENT_DATA?.last_name}
                    <img src={generateSVGAvatar($PATIENT_DATA?.first_name + " " + $PATIENT_DATA?.last_name)} alt="">
                {:else}
                    <img src={generateSVGAvatar("Guest")} alt="">
                {/if}
            </div>
        </div>
    </Block>
    <BlockTitle class="!font-bold">Profile</BlockTitle>
    <div class="list links-list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <a on:click={()=> f7.popup.open('.profile')} class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="heroicons:user"  class="h-4 w-4"  />
                            Manage Your Profile
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <a class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="hugeicons:hierarchy-square-04"  class="h-4 w-4" />
                            Join A Group
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>
    <BlockTitle class="!font-bold">Billing & Support</BlockTitle>
    <div class="list links-list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <a href="/subscriptions" class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="heroicons:gift"  class="h-4 w-4" />
                            Subscriptions
                        </div>
                    </div>
                </a>
            </li>
            <li>
                <Link href="https://tawk.to/chat/66de364250c10f7a00a5f9d4/1i7a0i0gd" external class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="streamline:customer-support-1"  class="h-4 w-4" />
                            Contact Support
                        </div>
                    </div>
                </Link>
            </li>
        </ul>
    </div>

    <BlockTitle class="!font-bold">Security</BlockTitle>
    <div class="list links-list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <a href="/2fa" class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="heroicons:shield-check" class="h-4 w-4" />
                            Enable 2 Factor Authentication
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>

    <div class="list links-list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <a on:click={logout} class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1 !text-primary-600">
                            <Icon icon="heroicons:arrow-left-end-on-rectangle-solid"  class="h-4 w-4" />
                            Log Out
                        </div>
                    </div>
                </a>
            </li>
        </ul>
    </div>


    <div class="flex items-center justify-center mt-12 italic">
        v{$version}
    </div>

    <Profile/>
</Page>