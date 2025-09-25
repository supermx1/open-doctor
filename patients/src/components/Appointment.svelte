<script>
    import {client} from "@/js/directus";
    import {readItems} from "@directus/sdk";
    import {onMount} from "svelte";
    import {getDayMonth, today, sortByDate} from "@/js/utils";
    import {Badge, Block, Link, PageContent, Sheet, SkeletonBlock, SkeletonText} from "framework7-svelte";
    import RelativeTime from "svelte-relative-time";
    import Loading from "@/components/Loading.svelte";
    import {quintOut} from "svelte/easing";
    import {slide} from "svelte/transition";
    import Icon from "@iconify/svelte";


    let loading = true;
    let appointments;
    export let limit = 3;
    let pageMessage = "You have no prescriptions issued.";
    let loadingSearch = false;

    let fromDate = "";
    let toDate = "";


    export let f7router;

    async function getAppointments() {
        try {
           const _d = await client.request(
                readItems('appointment', {
                    sort: ['sort', '-date_created'],
                    limit: 25,
                    fields: ['*.*', 'assigned_doctor.*'],
                    filter: {
                        _or: [
                            {
                                status:{
                                    _neq: 'cancelled'
                                }
                            },
                        ]
                    }
                })
            );
            // appointments = sortByDate(_d);

            appointments = sortByDate(_d).slice(0, limit);
            console.log('arranged appointments',appointments);
            // console.log('unarranged appointments',_d);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            loading = false; // Set loading to false after fetching
        }
    }

    async function searchAppointments() {
        console.log(new Date(fromDate).toISOString(), new Date(toDate).toISOString());
        loadingSearch = true;
        try {
            appointments = await client.request(
                readItems('appointment', {
                    filter: {
                        _and: [
                            {
                                date_created: {_between: [new Date(fromDate).toISOString(), new Date(toDate).toISOString()]}
                            }
                        ],
                    },
                    sort: ['sort', '-date_created'],
                    fields: ['*.*'],
                    limit: 10
                })
            );
            if (appointments.length === 0) {
                pageMessage = "No appointments found for the selected date.";
            }
            loadingSearch = false;
            console.log(appointments);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            loadingSearch = false; // Set loading to false after fetching
        }
    }

    onMount(async ()=>{
        await getAppointments();
    })

</script>

{#if loading}
    {#each [1, 2] as _}
<div class="bg-white rounded-lg p-2 flex gap-4 hover:bg-zinc-50 transition mb-3">
    <SkeletonBlock class="skeleton-effect-pulse" style="width: 50px; height: 60px; border-radius: 0.5rem"/>
    <div>
        <SkeletonText effect={'pulse'} tag="h1">Appointment Type</SkeletonText>
        <SkeletonText effect={'pulse'} tag="p">Assigned Doctor</SkeletonText>
        <SkeletonText effect={'pulse'} tag="p">Date</SkeletonText>
    </div>
</div>
    {/each}
    {:else }
    {#if appointments && appointments.length}
    {#each appointments as appointment}
        <Link class="!block !w-full !m-0 !p-0 transform transition-transform duration-300 hover:scale-[1.01]" href="/appointment/{appointment.id}" key={appointment.id}>
            <div class="bg-white rounded-lg p-2 flex gap-4 hover:bg-zinc-50 transition mb-3">
        <div class="bg-zinc-100 rounded-lg px-4 py-1 flex flex-col justify-center text-center">
            <h1 class="text-xl">{getDayMonth(appointment.date).day}</h1>
            <p class="text-muted">{getDayMonth(appointment.date).month}</p>
        </div>
        <div>
            <h1 class="text-base font-bold">
                {#if appointment.type === 'phone'}
                    Phone
                {:else if appointment.type === 'chat'}
                    Chat
                {:else}
                    Video
                {/if}
                Appointment</h1>
            {#if appointment.assigned_doctor}
                <p class="text-muted text-sm capitalize">Assigned: <i>Dr. {appointment.assigned_doctor.first_name} {appointment.assigned_doctor.last_name}</i></p>
            {/if}
            <RelativeTime class="font-semibold capitalize" date={new Date(appointment.date)} locale="en"/>
        </div>
        <div class="w-auto flex-1 flex justify-end pr-2 pt-1">
            {#if appointment.status === 'pending'}
                <Badge color="yellow">P</Badge>
            {:else if appointment.status === 'completed'}
                <Badge color="green">C</Badge>
            {:else}
                <Badge color="red">R</Badge>
            {/if}
        </div>
    </div>
        </Link>
    {/each}
    {:else}
        <div class="h-16 flex justify-center items-center flex-col gap-4"
             in:slide={{ y: 200, easing: quintOut, axis: 'y', opacity: 0.5  }}>
            <p>{pageMessage}</p>
            <Link on:click={getAppointments}>
                <Icon icon="prime:refresh"  class="w-8 h-8 text-primary-600" />
            </Link>
        </div>

    {/if}
{/if}

<Sheet class="search-appointment" style="height: auto" swipeToClose backdrop>
    <div class="swipe-handler"/>
    <Block>
        <PageContent>
            <form on:submit|preventDefault={searchAppointments}>
                <div class="grid grid-cols-2 gap-1">
                    <div class="col-span-1 gap-1">
                        <label for="fromDate" class="text-sm mb-2 dark:text-white">From</label>
                        <input type="date" bind:value={fromDate} id="fromDate"
                               class="placeholder:text-base !text-lg" placeholder="Date" required/>
                    </div>
                    <div class="col-span-1 gap-1">
                        <label for="toDate" class="text-sm mb-2 dark:text-white">To</label>
                        <input type="date" bind:value={toDate} min={fromDate} id="toDate" class="placeholder:text-base !text-lg"
                               placeholder="Date" required/>
                    </div>
                    <div class="col-span-2 mt-3">
                        <button type="submit"
                                class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                            {#if loadingSearch}
                                <Loading color="text-white"/>
                            {:else}
                                Search
                            {/if}
                        </button>
                    </div>
                </div>
            </form>
        </PageContent>
    </Block>
</Sheet>
