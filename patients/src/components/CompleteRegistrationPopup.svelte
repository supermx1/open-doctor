<script>
    import {Block, BlockTitle, f7, Link, Page, Popup} from "framework7-svelte";
    import { site } from "@/js/store/site"

    export let f7router;
    export let f7route;

    function navigateToProfile() {
        f7.popup.close('.complete-registration');
        f7.views.main.router.navigate('/settings');
        // f7router.navigate('/settings');
        setTimeout(() => {
            f7.popup.open('.profile');
        }, 100);
    }
</script>

<Popup class="complete-registration" swipeToClose="to-bottom" swipeHandler=".swipe-handler">
    <Page>
        <div slot="fixed" class="swipe-handler" />
        <img src="/img/complete-reg.webp" alt="Complete Registration" class="w-full h-96 object-cover"/>
        <Block class="text-center space-y-6">
            <h1 class="text-3xl font-medium">Thank you for registering with {$site.title} 🎉</h1>
            <p class="text-lg">
               To complete your registration, please click the button below to fill out other relevant information.
            </p>
           <Link on:click={navigateToProfile} class="disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
               Complete Registration
           </Link>
        </Block>
    </Page>
</Popup>