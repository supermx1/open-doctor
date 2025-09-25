<script>
    import {
        Block,
        BlockTitle,
        f7,
        Link,
        List,
        ListItem,
        Navbar, NavLeft,
        NavRight, NavTitle,
        Page,
        PageContent,
        Sheet
    } from "framework7-svelte";
    import {calculateAge, formatDate, formatDateDay, past, today} from "@/js/utils";
    import { client } from "@/js/directus";
    import {readItems, updateItem} from "@directus/sdk";
    import {onMount} from "svelte";
    import Icon from "@iconify/svelte";
    import NavBar from "@/components/NavBar.svelte";
    import Loading from "@/components/Loading.svelte";
    import { BLOOD_GROUPS, GENOTYPES, GENDER } from "@/js/data";

    let loading = false;
    let myRecords;
    $: dateOfBirth = "";
    $: bloodGroup = "";
    $: genotype = "";
    $: height = "";
    $: weight = "";
    $: sex =  "";

    async function updateBioData() {
        loading = true;
        try {
            await client.request(updateItem('patients', myRecords[0].id, {
                date_of_birth: dateOfBirth,
                blood_group: bloodGroup,
                genotype: genotype,
                height: height,
                weight: weight,
                gender: sex
            }
            ));
            f7.sheet.close('.update-biodata');
            f7.toast.create({
                text: "Bio Data updated successfully.",
                position: "bottom",
                closeTimeout: 3000,
                cssClass: "bg-blue",
            }).open();
        } catch (e) {
            console.error(e);
            f7.toast.create({
                text: e.errors[0].message,
                position: "bottom",
                closeTimeout: 3000,
                cssClass: "bg-red",
            }).open();
            loading = false;
        } finally {
            loading = false;
        }
    }

    async function getMyDetails() {
        try {
            myRecords = await client.request(readItems('patients', {
                fields: ['id', 'date_of_birth', 'blood_group', 'genotype', 'height', 'weight', 'patient_id', 'gender']
            }));
            dateOfBirth = myRecords[0].date_of_birth;
            bloodGroup = myRecords[0].blood_group;
            genotype = myRecords[0].genotype;
            height = myRecords[0].height;
            weight = myRecords[0].weight;
            sex = myRecords[0].gender;
            console.log(myRecords);
        } catch (error) {
            console.error("Failed to fetch user details:", error);
        }
    }

    let hideButton = false;

    function openSheet() {
        hideButton = true;
        f7.sheet.open('.update-biodata');
    }

    function calculateBMI() {
        let bmi = weight / ((height/100) * (height/100));
        return bmi.toFixed(2);
    }

    onMount(async () => {
        await getMyDetails();
    });
</script>

<Page name="bio-data">
    <NavBar title="Bio Data">
<!--        <img slot="icon" src="/img/vitals.webp" alt="prescription icon" class="w-4 h-4" />-->
    </NavBar>
    <div class="list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="icons8:gender" class="h-4 w-4" />
                            Sex
                        </div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{sex || ""}</span>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="heroicons:calendar-date-range" class="h-4 w-4" />
                            Date of Birth</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{ dateOfBirth ? formatDateDay(dateOfBirth) + ` (` + calculateAge(dateOfBirth) + `)` : ""}</span>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="hugeicons:blood" class="h-4 w-4" />
                            Blood Group</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{bloodGroup || ""}</span>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="healthicons:blood-drop-outline" class="h-4 w-4" />
                            Genotype</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{genotype || ""}</span>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="healthicons:height-outline" class="h-4 w-4" />
                            Height</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{height + `cm` || ""}</span>
                        </div>
                    </div>
                </div>
            </li>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="healthicons:weight-outline" class="h-4 w-4" />
                            Weight</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span>{weight + `kg` || ""}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    {#if weight && height}
    <div class="list list-strong-ios list-dividers-ios inset shadow-sm">
        <ul>
            <li>
                <div class="item-content">
                    <div class="item-inner">
                        <div class="item-title !text-sm flex items-center gap-1">
                            <Icon icon="healthicons:blood-pressure-outline" class="h-4 w-4" />
                            BMI</div>
                        <div class="item-after !font-medium flex items-center gap-1">
                            <span
                                    class:text-red-700={calculateBMI() < 18.5}
                            class:text-green-600={calculateBMI() > 18.5 && calculateBMI() < 24.5}
                            class:text-yellow-600={calculateBMI() > 24.5 && calculateBMI() < 29.9}
                            class:text-red-600={calculateBMI() > 30}
                            >{calculateBMI()}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    {/if}
    <Block>
        <button on:click={openSheet} class:hidden={hideButton} class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
            Edit Data
        </button>
    </Block>
    <Sheet class="update-biodata" style="height: auto" swipeToClose backdrop onSheetClose={()=> hideButton = false}>
        <Block>
            <PageContent>
                <form on:submit|preventDefault={updateBioData}>
                    <div class="grid grid-cols-2 gap-2">
                        <div class="col-span-1">
                            <label for="sex" class="text-sm mb-2 dark:text-white">Sex</label>
                            <select id="sex" bind:value={sex} class="capitalize">
                                {#each GENDER as gender}
                                    <option value={gender} class="capitalize">{gender}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label for="dateOfBirth" class="text-sm mb-2 dark:text-white">Date of Birth</label>
                            <input type="date" bind:value={dateOfBirth} max={past.toISOString().substring(0, 10)}  id="dateOfBirth" class="placeholder:text-base"
                                   placeholder="Date" required/>
                        </div>
                        <div class="col-span-1">
                            <label for="bloodGroup" class="text-sm mb-2 dark:text-white">Blood Group</label>
                            <select id="bloodGroup" bind:value={bloodGroup}>
                                {#each BLOOD_GROUPS as bloodGroup}
                                    <option value={bloodGroup}>{bloodGroup}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label for="genotype" class="text-sm mb-2 dark:text-white">Genotype</label>
                            <select id="genotype"  bind:value={genotype}>
                                {#each GENOTYPES as genotype}
                                    <option value={genotype}>{genotype}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-span-1">
                            <label for="height" class="text-sm mb-2 dark:text-white">Height(cm)</label>
                            <input type="number" bind:value={height} min="130" max="270" id="height" class="placeholder:text-base !text-lg"
                                   placeholder="Height" required/>
                        </div>
                        <div class="col-span-1">
                            <label for="weight" class="text-sm mb-2 dark:text-white">Weight(kg)</label>
                            <input type="number"  bind:value={weight} min="40" max="150" id="weight" class="placeholder:text-base !text-lg"
                                   placeholder="Weight" required/>
                        </div>
                        <div class="col-span-2">
                            <button type="submit"
                                    class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                                {#if loading}
                                    <Loading color="text-white"/>
                                {:else}
                                    Update
                                {/if}
                            </button>
                        </div>

                    </div>
                </form>
            </PageContent>
        </Block>
        <div class="swipe-handler"/>
    </Sheet>

</Page>