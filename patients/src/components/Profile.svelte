<script>
    import Icon from "@iconify/svelte";
    import {f7, Block, BlockTitle, Link, Navbar, NavRight, Page, Popup,} from "framework7-svelte";
    import Loading from "@/components/Loading.svelte";
    import {client, getMyDetails} from "@/js/directus";
    import {PATIENT_DATA} from "@/js/store/user";
    import {COUNTRIES, STATES} from "@/js/data";
    import {updateItem} from "@directus/sdk";
    import Warning from "@/components/alerts/Warning.svelte";

    let loading = false;
    let disabled = false;
    let firstName = "";
    let lastName = "";
    let email = "";
    let phone = "";
    let country = "1";
    let state = "";
    let address = "";
    let emergencyName = "";
    let emergencyPhone = "";

    async function updateProfile() {
        loading = true;

        try {
            f7.dialog.confirm('Are you sure you want to update your profile?', async () => {
                const _d = await client.request(
                    updateItem('patients', $PATIENT_DATA.id, {
                        first_name: firstName,
                        last_name: lastName,
                        phone,
                        country,
                        state,
                        address,
                        emergency_contact_fullname: emergencyName,
                        emergency_contact_phone: emergencyPhone
                    })
                );
                f7.toast.create({
                    text: "Profile updated successfully",
                    position: "bottom",
                    closeTimeout: 3000,
                    cssClass: "bg-blue",
                }).open();
                loading = false;
                await getMyDetails();
            }, () => {
                loading = false;
            });

        } catch (error) {
            console.error(error);
            f7.toast.create({
                text: error.errors[0].message,
                position: "bottom",
                closeTimeout: 3000,
                cssClass: "bg-red",
            }).open();
            loading = false;
        }
    }

    function pushData() {
        firstName = $PATIENT_DATA?.first_name || "";
        lastName = $PATIENT_DATA?.last_name || "";
        email = $PATIENT_DATA?.email || "";
        phone = $PATIENT_DATA?.phone || "";
        country = $PATIENT_DATA?.country || "";
        state = $PATIENT_DATA?.state || "";
        address = $PATIENT_DATA?.address || "";
        emergencyName = $PATIENT_DATA?.emergency_contact_fullname || "";
        emergencyPhone = $PATIENT_DATA?.emergency_contact_phone || "";
    }

    $: $PATIENT_DATA?.email && pushData();
    
    

</script>

<Popup class="profile">
    <Page>
        <Navbar title="Profile" class="custom-navbar print:hidden">
            <NavRight>
                <Link popupClose>
                    <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6 text-zinc-800"/>
                </Link>
            </NavRight>
        </Navbar>


        <Block>

            {#if $PATIENT_DATA?.phone === null || $PATIENT_DATA?.phone === "" || $PATIENT_DATA?.address === ""}
                <Warning title="Complete Registration"
                         message="Please complete your registration by entering all relevant information."/>
            {/if}


            <form on:submit|preventDefault={updateProfile}>
                <BlockTitle>Personal Information</BlockTitle>
                <div class="grid grid-cols-2 gap-2 mt-6">
                    <div class="col-span-2">
                        <label for="lastName" class="text-sm mb-2 ">Last Name</label>
                        <input type="text" bind:value={lastName} id="lastName" class="placeholder:text-base !text-lg"
                               placeholder="Enter Your Last Name" required/>
                    </div>
                    <div class="col-span-2">
                        <label for="firstName" class="text-sm mb-2 ">First Name</label>
                        <input type="text" bind:value={firstName} id="firstName" class="placeholder:text-base !text-lg"
                               placeholder="Enter Your First Name" required/>
                    </div>
                    <div class="col-span-2">
                        <label for="phone" class="text-sm mb-2 ">Phone (WhatsApp)</label>
                        <input type="tel" bind:value={phone} id="phone" class="placeholder:text-base !text-lg"
                               placeholder="Enter Your Phone Number" minlength="11" required/>
                    </div>

                    <div class="col-span-2">
                        <p on:click={()=> f7.dialog.alert("Your registered email. If you want to change this email, please contact us")} class="text-sm mb-2 flex items-center gap-1">
                            Email
                            <Icon icon="heroicons:information-circle" class="icon-tooltip w-4 h-4 text-primary-600"/>
                        </p>
                        <p class="font-bold text-lg">{email}</p>
                    </div>
                    <div class="col-span-2">
                        <hr/>
                    </div>

                    <BlockTitle class="!overflow-visible">Contact Information</BlockTitle>
                    <div class="col-span-2">
                        <label for="address" class="text-sm mb-2 ">Address</label>
                        <textarea bind:value={address} id="address" class="placeholder:text-base !text-lg"
                                  placeholder="Enter Your Address" required></textarea>
                    </div>
                    <div class="col-span-2">
                        <label for="country" class="text-sm mb-2 ">Country</label>
                        <select id="country" bind:value={country}>
                            {#each COUNTRIES as country}
                                <option value={country.id}>{country.name}</option>
                            {/each}
                        </select>
                    </div>
                    {#if country === 1}
                        <div class="col-span-2">
                            <label for="state" class="text-sm mb-2 ">State</label>
                            <select id="state" bind:value={state}>
                                {#each STATES as state}
                                    <option value={state.id}>{state.name}</option>
                                {/each}
                            </select>
                        </div>
                    {/if}


                    <div class="col-span-2">
                        <hr/>
                    </div>

                    <BlockTitle class="!overflow-visible">Emergency Contact</BlockTitle>
                    <div class="col-span-2">
                        <label for="emergencyName" class="text-sm mb-2 ">Full Name</label>
                        <input type="text" bind:value={emergencyName} id="emergencyName"
                               class="placeholder:text-base !text-lg" placeholder="Enter Your Emergency Contact Name"/>
                    </div>
                    <div class="col-span-2">
                        <label for="emergencyPhone" class="text-sm mb-2 ">Phone</label>
                        <input type="tel" bind:value={emergencyPhone} id="emergencyPhone"
                               class="placeholder:text-base !text-lg" placeholder="Enter Your Emergency Contact Phone"
                               minlength="11"/>
                    </div>

                    <div class="col-span-2">
                        <button {disabled} type="submit"
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

        </Block>

    </Page>
</Popup>