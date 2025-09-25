<script>
    import {
        Badge,
        Block,
        BlockTitle, f7,
        Link,
        Navbar,
        NavLeft,
        NavTitle,
        Page,
        SkeletonBlock,
        SkeletonText
    } from "framework7-svelte";
    import Icon from "@iconify/svelte";
    import {onMount} from "svelte";
    import {formatDateDay, formatTime} from "@/js/utils";
    import {client} from "@/js/directus";
    import {readItem, updateItem} from "@directus/sdk";
    import NavBar from "@/components/NavBar.svelte";
    import {PATIENT_DATA} from "@/js/store/user";
    import Chat from "@/components/Chat.svelte";
    import Chat2 from "@/components/Chat2.svelte";
    import Chat3 from "@/components/Chat3.svelte";

    export let f7router;
    export let f7route;

    let appointment;

    async function getAppointment() {
        try {
            appointment = await client.request(readItem('appointment', f7route.params.id, {
                fields: ['*.*', 'assigned_doctor.*']
            }));
        } catch (e) {
            console.error(e);
        }
    }

    async function cancelAppointment() {
        f7.dialog.confirm('Are you sure you want to cancel this appointment?', async () => {
            try {
                await client.request(updateItem('appointment', f7route.params.id, { status: 'cancelled' }));
                f7.dialog.alert('Appointment cancelled successfully');
                f7router.navigate('/all-appointments');
            } catch (e) {
                console.error(e);
            }
        });
    }

    $: messageLink = `https://wa.me/%2B234${appointment?.assigned_doctor?.phone}?text=Hello%20Dr.%20${appointment?.assigned_doctor?.last_name},%20I%20am%20${$PATIENT_DATA?.first_name}%20${$PATIENT_DATA?.last_name}.%20I%20have%20an%20appointment%20with%20you%20on%20${formatDateDay(appointment?.date)}.I%20would%20like%20to%20begin%20my%20consultation`;
    onMount(async () => {
        console.log(f7route.params.id);
        await getAppointment();
    });


</script>

<Page name="appointment">
    <NavBar title="Appointment"/>
    {#if appointment}
        <div class="list list-strong-ios list-dividers-ios inset shadow-sm">
            <ul>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title !text-sm flex items-center gap-1">
                                <Icon icon="heroicons:calendar-days" class="h-4 w-4"/>
                                Appointment Date
                            </div>
                            <div class="item-after !font-medium flex items-center gap-1">
                                <span>{formatDateDay(appointment.date)}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title !text-sm flex items-center gap-1">
                                <Icon icon="heroicons:clock" class="h-4 w-4"/>
                                Appointment Time
                            </div>
                            <div class="item-after !font-medium flex items-center gap-1">
                                <span>{formatTime(appointment.time)}</span>
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title !text-sm flex items-center gap-1">
                                <Icon icon="heroicons:arrows-up-down"  class="h-4 w-4" />
                                Type
                            </div>
                            <div class="item-after !font-medium flex items-center gap-1">
                                {#if appointment.type === 'phone'}
                                    <Badge class="px-2 bg-purple-800">Phone Call</Badge>
                                {:else if appointment.type === 'video'}
                                    <Badge class="px-2 bg-blue-800">Video Call</Badge>
                                {:else}
                                    <Badge class="px-2 bg-orange-600">Chat</Badge>
                                {/if}
                            </div>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="item-content">
                        <div class="item-inner">
                            <div class="item-title !text-sm flex items-center gap-1">
                                <Icon icon="heroicons:check-circle" class="h-4 w-4"/>
                                Status
                            </div>
                            <div class="item-after !font-medium flex items-center gap-1">
                                {#if appointment.status === 'pending'}
                                    <Badge color="yellow" class="px-2">Pending</Badge>
                                {:else if appointment.status === 'completed'}
                                    <Badge color="green" class="px-2">Completed</Badge>
                                {:else}
                                    <Badge color="red" class="px-2">Cancelled</Badge>
                                {/if}
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="list list-strong-ios list-dividers-ios inset shadow-sm">
            <ul>
                <li class="accordion-item">
                    <a class="item-link item-content">
                        <div class="item-inner">
                            <div class="item-title !text-sm flex items-center gap-2 pl-1">
                                <span class="relative flex h-3 w-3 overflow-visible">
                                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 "></span>
                                  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                                </span>
                                <span>Reason</span>
                            </div>
                        </div>
                    </a>
                    <div class="accordion-item-content">
                        <div class="block">
                            <p>
                                {@html appointment.description}
                            </p>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        {#if appointment.assigned_doctor}
            <BlockTitle>Assigned Doctor</BlockTitle>
            <div class="list list-strong-ios list-dividers-ios inset shadow-sm">
                <ul>
                    <li>
                        <div class="item-content">
                            <div class="item-inner">
                                <div class="item-title !text-sm flex items-center gap-1">
                                    <Icon icon="healthicons:stethoscope-outline"  class="h-4 w-4" />
                                    Dr. {appointment.assigned_doctor?.last_name} {appointment.assigned_doctor?.first_name}
                                </div>
                                <div class="item-after !font-medium">
                                    {#if appointment.assigned_doctor.can_be_messaged}
                                        <Link external href={messageLink} class="flex items-center gap-2">
                                            Connect <Icon icon="logos:whatsapp-icon" />
                                        </Link>

                                    {:else}
                                        <span>{appointment.assigned_doctor?.last_name} {appointment.assigned_doctor?.first_name}</span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        {/if}
        <Block>
            {#if appointment.type === 'phone' && appointment?.assigned_doctor?.phone}
                <Link external href="tel:{appointment?.assigned_doctor?.phone}" class="flex items-center justify-center gap-2 text-base w-full bg-purple-800 text-white font-medium rounded-lg py-4">
                    <Icon icon="heroicons:phone-arrow-up-right-20-solid"   />
                    Call Doctor
                </Link>
        {/if}
            {#if appointment.type === 'chat'}
                <Link on:click={()=> f7.popup.open('.chat')} class="flex items-center justify-center gap-2 text-base w-full bg-orange-600 text-white font-medium rounded-lg py-4">
                    <Icon icon="heroicons:chat-bubble-left-right" />
                    Chat with Doctor
                </Link>
            {/if}
        </Block>
        <Chat3 {appointment}/>
        {#if appointment.status === 'pending' && new Date(appointment.date) >= new Date()}
            <Link on:click={cancelAppointment} class=" text-primary-600 flex justify-center">Cancel Appointment</Link>
        {/if}

    {:else}
        <div class="bg-white rounded-lg p-2 flex flex-col gap-4 hover:bg-zinc-50 transition mb-3 list list-strong-ios list-dividers-ios inset shadow-sm">
            <SkeletonText effect={'pulse'} tag="h1">Appointment Type</SkeletonText>
            <SkeletonText effect={'pulse'} tag="p">Assigned Doctor</SkeletonText>
            <SkeletonText effect={'pulse'} tag="p">Date</SkeletonText>
        </div>
    {/if}


</Page>
<style>
    :global(ol){
        list-style-type: decimal;
        margin: 1em 0;
        padding-left: 40px;
    }
    :global(ol li){
        margin: 0.5em 0;
        padding-left: 0;
    }
</style>