<script>
  import { onMount } from 'svelte';
  import { getDevice }  from 'framework7/lite-bundle';
  import {
    f7,
    f7ready,
    App,
    Views,
    View,
    Toolbar,
    Link,
  } from 'framework7-svelte';
  import capacitorApp from './js/capacitor-app';
  import routes from './js/routes';
  import {client} from "@/js/directus";
  import {PATIENT_DATA, USER} from "@/js/store/user";
  import LoadingPage from "@/components/LoadingPage.svelte";
  import Icon from "@iconify/svelte";
  import AdPopUp from "@/components/AdPopUp.svelte";
  import NotficationsPopUp from "@/components/NotficationsPopUp.svelte";
  import CompleteRegistrationPopup from "@/components/CompleteRegistrationPopup.svelte";
  import {requestPermission} from "@/js/firebase";
  import "driver.js/dist/driver.css";

  const device = getDevice();
  // Framework7 Parameters
  let f7params = {
    name: 'Sandsclinic', // App name
    theme: 'ios', // Automatic theme detection
    // App routes
    routes: routes,

    // Register service worker (only on production build)
    serviceWorker: process.env.NODE_ENV ==='production' ? {
      path: '/service-worker.js',
    } : {},
    // Input settings
    input: {
      scrollIntoViewOnFocus: device.capacitor,
      scrollIntoViewCentered: device.capacitor,
    },
    // Capacitor Statusbar settings
    statusbar: {
      iosOverlaysWebView: true,
      androidOverlaysWebView: false,
    },
    // colors: {
    //   primary: '#ce3051',
    // }
  };


  async function refreshUser() {
    try {
        $USER = await client.refresh() || null;
        } catch (error) {
          $USER = null;
        console.error(error);
    }
  }

  onMount(async () => {
    f7ready(() => {

      // Init capacitor APIs (see capacitor-app.js)
      if (f7.device.capacitor) {
        capacitorApp.init(f7);
      }
      // Call F7 APIs here
    });
    await refreshUser();
    await requestPermission();
  })

  $: if($PATIENT_DATA?.phone === null || $PATIENT_DATA?.phone === "") {
    f7.popup.open('.complete-registration');
  }

</script>

<App { ...f7params }>

  {#if $USER}
    <!-- Views/Tabs container -->
    <Views tabs class="safe-areas">
      <!-- Tabbar for switching views-tabs -->
      <Toolbar tabbar icons bottom>
        <Link tabLink="#view-home" tabLinkActive>
          <Icon icon="solar:home-smile-angle-bold-duotone"  class="w-8 h-8" />
          <p class="tabbar-label">Home</p>
        </Link>

        <Link tabLink="#view-new-appointment" >
          <span class="main-icon text-white absolute bottom-6 z-[9999] rounded">
            <Icon icon="solar:calendar-add-linear"  class=" w-9 h-9"  />
          </span>
        </Link>

        <Link tabLink="#view-settings">
          <Icon icon="solar:user-rounded-bold-duotone"  class="w-8 h-8" />
          <p class="tabbar-label">Profile</p>
        </Link>
      </Toolbar>

      <!-- Your main view/tab, should have "view-main" class. It also has "t abActive" prop -->
      <View id="view-home" main tab tabActive url="/" />

      <!-- Settings View -->
      <View id="view-new-appointment" name="appointment" tab url="/new-appointment" />

      <!-- Settings View -->
      <View id="view-settings" name="settings" tab url="/settings" />

    </Views>
    <NotficationsPopUp />
    <AdPopUp />
    <CompleteRegistrationPopup />
    <!--  -->
    {:else if $USER === undefined}
    <LoadingPage />
    {:else}
    <View class="safe-areas" url="/login" />
  {/if}




</App>
