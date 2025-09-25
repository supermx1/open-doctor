<script>
    import {
        Badge,
        Block,
        BlockTitle,
        Link,
        Navbar,
        Page,
        SkeletonBlock,
        SkeletonText,
        SkeletonAvatar,
        SkeletonImage, NavRight, f7
    } from "framework7-svelte";
    import {ME, PATIENT_DATA} from "@/js/store/user";
    import {onDestroy, onMount} from "svelte";
    import {client, getMyDetails, getPlans, updateLocation} from "@/js/directus";
    import {readItems, readMe} from "@directus/sdk";
    import {timeOfDayGreeting, removeNavbar, isPast, copy} from "@/js/utils";
    import RelativeTime from 'svelte-relative-time';
    import Icon from "@iconify/svelte";
    import Appointment from "@/components/Appointment.svelte";
    import {notificationCount} from "@/js/store/notification";
    import Tour from '@/js/tour';


    let greeting = "";


    const menu = [
        {
            title: "Bio Data",
            icon: "vitals.webp",
            link: "/bio-data"
        },
        {
            title: "Prescriptions",
            icon: "prescriptionss.webp",
            link: "/prescriptions"
        },
        {
            title: "Tests",
            icon: "tests.webp",
            link: "/tests"
        }
    ]

    async function loadMore(done) {
        setTimeout(async () => {
            await getPlans();
            await getMyDetails();
            done();
        }, 1000);
    }

    let coordinates = null;

    async function getGPS() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                coordinates = {
                    type: 'Point',
                    coordinates: [ position.coords.longitude, position.coords.latitude]
                };
                if(coordinates) updateLocation($PATIENT_DATA?.id, coordinates);
            });
        } else {
            console.error('Error getting location.');
        }
    }


    const welcomeTour = new Tour([
        { element: '.notificationClass', popover: { title: 'Notification', description: 'This is a notification button' } },
        { element: '.yourHealth-0', popover: { title: 'Bio Data', description: 'Enter you bio data here' } },
        { element: '.yourHealth-1', popover: { title: 'Prescription', description: 'You will find your prescriptions' } },
        { element: '.yourAppointments', popover: { title: 'Appointments', description: 'You will find your app' } },
    ]);

    onMount(async () => {
        greeting = timeOfDayGreeting();
        $ME = await client.request(readMe({fields: ['*']}));
        await getMyDetails();
        await getPlans();
        await getGPS();

        setTimeout(() => {
            welcomeTour.start();
        }, 2000);
    });
    removeNavbar();







</script>

<Page ptr ptrMousewheel={true} onPtrRefresh={loadMore} name="home" class="pt-6">
    <Block class="">
        <div class="flex justify-between mb-5">
            <div id="patient-info" class="">
                <p class="text-muted text-sm">{greeting},</p>
                <h1 class="text-2xl font-bold capitalize">{$PATIENT_DATA?.first_name|| 'Guest'}</h1>
                {#if $PATIENT_DATA?.patient_id}
                    <p class="text-muted text-sm font font-medium">
                        Patient ID: <span on:click={()=> copy($PATIENT_DATA?.patient_id, "Patient ID copied")} class="text-primary-600">{$PATIENT_DATA?.patient_id}
                    </span></p>
                {/if}
            </div>

            <div class="">

                <Link on:click={()=> f7.popup.open('.notifications')} class="notificationClass bg-zinc-200 rounded-full p-3 h-12 w-12 relative">
                    <Icon icon="ph:chat-teardrop-text-bold"  class="absolute text-zinc-600 text-4xl" />
                    <Badge class="bg-primary-600 absolute top-0 right-0">{$notificationCount}</Badge>
                </Link>
            </div>
        </div>

        <div  class="flex rounded-xl bg-gradient-to-br from-primary-700 via-primary-600 to-primary-700 p-4 relative ">
            <div class="flex flex-col gap-5 w-[45%]">
                {#if isPast($PATIENT_DATA?.plan_expiry) && !$PATIENT_DATA?.plan}
                    <h1 class="text-xl text-white font-medium">Get started by purchasing a subscription</h1>
                    <Link href="/subscriptions" class="w-auto bg-zinc-900 rounded-lg px-5 py-4 text-white">Subscribe</Link>
                {:else }
                    <h1 class="text-xl text-white font-medium">Book and schedule an appointment</h1>
                    <Link href="/new-appointment" class="w-auto bg-zinc-900 rounded-lg px-5 py-4 text-white">Book Now</Link>
                {/if}
            </div>
            <div class="absolute right-0 bottom-0">
                <img src="/img/doctor.webp" alt="doctor" class=" h-[14rem] "/>
            </div>
        </div>

        <BlockTitle class="!font-bold">Your Health</BlockTitle>
        <div class="grid grid-cols-4 gap-4">
            {#each menu as {title, icon, link}, i}
                <a href="{link}" class="yourHealth-{i} col-span-1 gap-2 flex flex-col justify-center  hover:text-red-600 group">
                    <img src="/img/{icon}" alt="{title}"
                         class="w-14 h-14 mx-auto transform transition-transform duration-300 group-hover:scale-90"/>
                    <span class="text-center text-xs font-bold">{title}</span>
                </a>
            {/each}
        </div>
        <BlockTitle class="!font-bold flex items-center justify-between mb-5">
            Your Appointments
            <Link href="/all-appointments" class="text-primary-600 !text-sm">View All</Link>
        </BlockTitle>

        <div class="yourAppointments">
            <!-- Appointments -->
            <Appointment limit={3}/>
            <!-- Appointments -->
        </div>
    </Block>


</Page>

<style>
    :global(.navbars.navbar-hidden){
        display: none !important;
    }
</style>