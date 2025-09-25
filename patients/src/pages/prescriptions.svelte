<script>
    import {
        Block, f7, Link,
        Navbar,
        NavLeft,
        NavRight,
        NavTitle,
        Page, PageContent, Popup,
        Sheet,
        SkeletonBlock,
        SkeletonText, Tab
    } from "framework7-svelte";
    import {slide} from "svelte/transition";
    import {onMount} from "svelte";
    import {client} from "@/js/directus";
    import {readItems} from "@directus/sdk";
    import {formatDateDay, generateQRCode, today} from "@/js/utils";
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import {quintOut} from "svelte/easing";
    import NavBar from "@/components/NavBar.svelte";
    import { site } from "@/js/store/site"

    let loading = true;
    let loadingSearch = false;
    let prescriptions;
    let pageMessage = "You have no prescriptions issued.";

    let fromDate = "";
    let toDate = "";

    async function getPrescriptions() {
        try {
            prescriptions = await client.request(
                readItems('prescription', {
                    filter: {
                        status: {_eq: 'active'}
                    },
                    sort: ['sort', '-date_created'],
                    limit: 3,
                    fields: ['*.*']
                })
            );
            console.log(prescriptions);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            loading = false; // Set loading to false after fetching
        }
    }

    async function searchPrescriptions() {
        console.log(new Date(fromDate).toISOString(), new Date(toDate).toISOString());
        loadingSearch = true;
        try {
            prescriptions = await client.request(
                readItems('prescription', {
                    filter: {
                        _and: [
                            {
                                status: {_eq: 'active'}
                            },
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
            if (prescriptions.length === 0) {
                pageMessage = "No prescriptions found for the selected date.";
            }
            loadingSearch = false;
            console.log(prescriptions);
        } catch (error) {
            console.error("Failed to fetch appointments:", error);
        } finally {
            loadingSearch = false; // Set loading to false after fetching
        }
    }

    let prescription = {};

    function printPrescription(i) {
        f7.popup.open('.print-prescription');
        prescription = prescriptions[i];
    }

    onMount(async () => {
        await getPrescriptions();
    })

    function openSearch() {
        f7.sheet.open('.search-prescription');
    }

</script>

<Page title="Prescriptions">
    <NavBar title="Prescriptions">
<!--            <img slot="icon" src="/img/appointments.webp" alt="prescription icon" class="w-4 h-4" />-->
            <Link slot="right" on:click={openSearch}>
                <Icon icon="heroicons:magnifying-glass-20-solid" class="text-primary-600 w-6 h-6"/>
            </Link>
    </NavBar>
    <Block>
        {#if loading}
            <div class="bg-white rounded-lg p-2 hover:bg-zinc-50 transition mb-3">
                <SkeletonText effect={'pulse'} tag="h1">Appointment Type</SkeletonText>
                <SkeletonText effect={'pulse'} tag="p">Assigned Doctor</SkeletonText>
                <SkeletonText effect={'pulse'} tag="p">Date</SkeletonText>
            </div>
        {:else}
            {#if prescriptions && prescriptions.length}
                {#each prescriptions as prescription, i}
                    <div class="bg-white rounded-xl mb-3" on:click={()=> printPrescription(i)}>
                        <div class="rounded-tl-lg rounded-tr-lg bg-yellow-400 px-3 py-2 border-b border-dashed border-zinc-300 flex items-center justify-between">
                            <h1 class="text-lg font-bold">{formatDateDay(prescription.date_created)}</h1>
                            <p>{prescription.medication.length} {prescription.medication.length > 1 ? 'items' : 'item'} </p>
                        </div>
                        <div class="grid grid-cols-2 border">
                            {#each prescription.medication as medication}
                                <div class="p-3 col-span-1 border-r border-zinc-200 border-b">
                                    {medication.name}
                                </div>
                                <div class="p-3 col-span-1 border-b border-zinc-200">
                                    {medication.dosage}
                                </div>
                            {/each}
                        </div>
                        <div class="rounded-bl-lg rounded-br-lg bg-zinc-200 p-3 flex items-center justify-between ">
                            {#if prescription.start_date}<p class="font-bold">
                                Start: {formatDateDay(prescription.start_date)}</p>{/if}
                            {#if prescription.end_date}<p class="font-bold">
                                End: {formatDateDay(prescription.end_date)}</p>{/if}
                        </div>
                    </div>
                {/each}
            {:else}
                <div class="h-16 flex justify-center items-center flex-col gap-4"
                     in:slide={{ y: 200, easing: quintOut, axis: 'y', opacity: 0.5  }}>
                    <p>{pageMessage}</p>
                    <Link on:click={getPrescriptions}>
                        <Icon icon="prime:refresh"  class="w-8 h-8 text-primary-600" />
                    </Link>
                </div>
            {/if}
        {/if}
    </Block>
    <Sheet class="search-prescription" style="height: auto" swipeToClose backdrop>
        <div class="swipe-handler"/>
        <Block>
            <PageContent>
                <form on:submit|preventDefault={searchPrescriptions}>
                    <div class="grid grid-cols-2 gap-1">
                        <div class="col-span-1 gap-1">
                            <label for="fromDate" class="text-sm mb-2 dark:text-white">From</label>
                            <input type="date" bind:value={fromDate} max={today.toISOString().substring(0, 10)} id="fromDate"
                                   class="placeholder:text-base !text-lg" placeholder="Date" required/>
                        </div>
                        <div class="col-span-1 gap-1">
                            <label for="toDate" class="text-sm mb-2 dark:text-white">To</label>
                            <input type="date" bind:value={toDate} min={fromDate} max={today.toISOString().substring(0, 10)} id="toDate" class="placeholder:text-base !text-lg"
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
    <Popup class="print-prescription">
        <Page>
            <Navbar title="Share Prescription" class="custom-navbar print:hidden">
                <NavRight>
                    <Link popupClose>
                        <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6 text-zinc-800" />
                    </Link>
                </NavRight>
            </Navbar>
            <Block>
                {#if prescription.date_created}
                    <div class="flex item-center justify-end text-lg font-bold mb-3 m-auto">
                        <p class="flex"><img src="/img/logo.png" class="w-7" alt="logo"/>{$site.title}</p>
                    </div>
                    <p class="font-bold text-blue-600">ID: {prescription.id}</p>
                    <p>Prescription by: <b>{$site.title}</b></p>
                    <p>Issued on: <b>{formatDateDay(prescription.date_created)}</b></p>
                    {#if prescription.start_date}<p>Start of Prescription:
                        <b>{formatDateDay(prescription.start_date)}</b></p>{/if}
                    {#if prescription.end_date}<p>End of Prescription: <b class="text-primary-600">{formatDateDay(prescription.end_date)}</b>
                    </p>{/if}

                    <table class="w-full border-collapse border border-zinc-600 mt-4">
                        <thead>
                        <tr>
                            <th class="border border-zinc-600 px-4 py-2">Medication</th>
                            <th class="border border-zinc-600 px-4 py-2">Dosage</th>
                        </tr>
                        </thead>
                        <tbody>
                        {#each prescription.medication as medication}
                            <tr>
                                <td class="border border-zinc-600 px-4 py-2">{medication.name}</td>
                                <td class="border border-zinc-600 px-4 py-2">{medication.dosage}</td>
                            </tr>
                        {/each}
                        </tbody>
                    </table>
                    <div class="flex flex-col items-center justify-center my-6 rounded-lg">
                        {#await generateQRCode('https://verifypresecription.sandsclinc.techgfxlimited.com/' + prescription.id)}
                            <Loading color="text-black"/>
                        {:then qrCode}
                            <p class="mb-2">Scan the QR code to verify this prescription</p>
                            <div class="w-24 h-24">
                                {@html qrCode}
                            </div>
                        {:catch error}
                            <p>{error.message}</p>
                        {/await}
                    </div>
                {/if}

            </Block>
            <div class="print:hidden absolute !z-[9999] left-1/2 bottom-8 transform -translate-x-1/2 w-[90%]">
                <button on:click={()=> window.print()}
                        class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                    Share
                </button>
            </div>
        </Page>
    </Popup>
</Page>

