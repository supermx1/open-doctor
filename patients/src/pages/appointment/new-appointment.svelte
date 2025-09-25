<script>
    import {client} from "@/js/directus";
    import {Block, f7, Link, Navbar, NavLeft, NavRight, NavTitle, Page, TextEditor,} from "framework7-svelte";
    import Icon from "@iconify/svelte";
    import Loading from "@/components/Loading.svelte";
    import {onMount} from "svelte";
    import {createItem} from "@directus/sdk";
    import { PATIENT_DATA } from "@/js/store/user";
    import NavBar from "@/components/NavBar.svelte";
    import {isTimeBetween, isPast} from "@/js/utils";
    import Warning from "@/components/alerts/Warning.svelte";

    export let f7router;

    let page = 1;
    let loading = false;
    let date = "";
    let time = "";
    let appointmentType = "";
    let description = "";
    let acceptTerms = false;
    async function bookAppointment() {
        if(isPast($PATIENT_DATA?.plan_expiry))
        {
            f7.toast.create({
                text: "Your subscription has expired. Please renew your subscription to book an appointment",
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
            return;
        }
        if(isTimeBetween("08:00", "18:00", time) === false) {
            f7.toast.create({
                text: "Appointment time should be between 8am and 6pm",
                position: "bottom",
                closeTimeout: 5000,
                cssClass: "bg-red",
            }).open();
            return;
        }
        loading = true;
        try {
            await client.request(createItem('appointment', {
                patient: $PATIENT_DATA.id,
                type: appointmentType,
                date,
                time,
                description,
            }));
            f7.toast.create({
                text: "Appointment booked successfully. You will be contacted shortly",
                position: "bottom",
                closeTimeout: 3000,
                cssClass: "bg-blue",
            }).open();
            setTimeout(() => {
                f7router.navigate('/');
            }, 5000);
        } catch (e) {
            console.error(e);
        }
        loading = false;
    }

    //TODO: Review this code. It may not work as expected
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().substring(0, 10);

</script>

<Page name="new-appointment">
    <NavBar title="Book Appointment" showLeft={false} showClose={true}/>



    <form on:submit|preventDefault={bookAppointment}>
    <Block>
        {#if page === 1}
            <p class="text-sm mb-2">Appointment Type</p>
            <ul class="grid w-full gap-3 grid-cols-2 md:grid-cols-2">
                <li class="col-span-2">
                    <input
                            bind:group={appointmentType}
                            type="radio"
                            id="phone"
                            name="appointmentType"
                            value="phone"
                            class="!hidden peer"
                            required
                    />
                    <label
                            for="phone"
                            class="radio-label peer-checked:bg-primary-100 peer-checked:border-primary-700 peer-checked:text-primary-600"
                    >
                        <Icon icon="heroicons:device-phone-mobile"  class="w-6 h-6 mt-0.5" />

                        <div class="">
                            <div class="w-full text-base font-semibold">Phone Call</div>
                            <div class="w-full text-xs">Have a doctor call you and you have voice consultation</div>
                        </div>
                    </label>
                </li>
                <li class="col-span-2">
                    <input
                            bind:group={appointmentType}
                            type="radio"
                            id="video"
                            name="appointmentType"
                            value="video"
                            class="!hidden peer"
                    />
                    <label
                            for="video"
                            class="radio-label peer-checked:bg-primary-100 peer-checked:border-primary-700 peer-checked:text-primary-600"
                    >
                        <Icon icon="heroicons:video-camera"  class="w-6 h-6 mt-0.5" />
                        <div class="">
                            <div class="w-full text-base font-semibold">Video Call</div>
                            <div class="w-full text-xs">Get a one on one video consultation session</div>
                        </div>
                    </label>
                </li>
                <li class="col-span-2">
                    <input
                            bind:group={appointmentType}
                            type="radio"
                            id="chat"
                            name="appointmentType"
                            value="chat"
                            class="!hidden peer"
                    />
                    <label
                            for="chat"
                            class="radio-label peer-checked:bg-primary-100 peer-checked:border-primary-700 peer-checked:text-primary-600"
                    >
                        <Icon icon="heroicons:chat-bubble-left-right"  class="w-6 h-6 mt-0.5" />
                        <div class="">
                            <div class="w-full text-base font-semibold">Chat</div>
                            <div class="w-full text-xs">Have a whatsapp or in-app conversation</div>
                        </div>
                    </label>
                </li>
            </ul>
        {/if}
        {#if page === 2}
            <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2">
                    <label for="date" class="text-sm mb-2">Appointment Date</label>
                    <input bind:value={date} min={new Date().toISOString().substring(0, 10)} type="date" id="date" class="!bg-white placeholder:text-base"
                           required/>
                </div>
                <div class="col-span-2">
                    <label for="time" class="text-sm mb-2">Appointment Time</label>
                    <input bind:value={time} type="time" id="time" class="!bg-white placeholder:text-base"
                           placeholder="Time" required min="08:00" max="18:00"/>
                </div>
                <div class="col-span-2">
                <Warning title="Please Note:" message="Appointment time should be between 8am and 6pm. African/Nigerian time."/>
                </div>
            </div>
        {/if}
        
        {#if page === 3}
            <div class="grid grid-cols-2 gap-2">
                <div class="col-span-2">
                    <label for="reason" class="text-sm mb-2">Reason for Appointment</label>
                    <TextEditor
                            class="!m-0"
                            placeholder="Reason for appointment. Provide as much details as you can give."
                            value={description}
                            onTextEditorChange={(value) => (description = value)}
                            buttons={[
                                "bold",
                                "italic",
                                "underline",
                                "orderedList",
                                "link",
                            ]}
                    />

                </div>
                <div class="col-span-2 mt-3">
                    <!-- Checkbox -->
                    <div class="flex items-center gap-2">
                        <input bind:checked={acceptTerms} type="checkbox" class="!h-5 !w-5 !p-0 !accent-primary-600 !text-primary-600" id="terms" required/>
                        <label for="terms" class="text-sm">I agree to the <Link class="text-primary-600" href="#">terms and conditions</Link></label>
                    </div>
                </div>
            </div>
        {/if}
    </Block>
        <div class:hidden={page !== 3} class=" absolute !z-[9999] left-1/2 bottom-28 transform -translate-x-1/2 w-[90%]">
            <div class="flex items-center gap-3">
                <Link on:click={()=> page = 2} class="text-primary-600 w-full flex items-center gap-2">
                    <Icon icon="heroicons:arrow-left-20-solid"  class="h-6 w-6" />
                    Back
                </Link>
                <button disabled={!acceptTerms || description === "" || date === "" || time === ""} type="submit"
                        class="disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                    Book Appointment
                </button>
            </div>
        </div>
    </form>
    <div class:hidden={page !== 1} class=" absolute !z-[9999] left-1/2 bottom-28 transform -translate-x-1/2 w-[90%]">
        <button on:click={() => page = 2}
                class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
            Continue
        </button>
    </div>

    <div class:hidden={page !== 2} class=" absolute !z-[9999] left-1/2 bottom-28 transform -translate-x-1/2 w-[90%]">
        <div class="flex items-center gap-3">
            <Link on:click={()=> page = 1} class="text-primary-600 w-full flex items-center gap-2">
                <Icon icon="heroicons:arrow-left-20-solid"  class="h-6 w-6" />
                Back
            </Link>
            <button on:click={() => page = 3}
                    class="flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
                Continue
            </button>
        </div>

    </div>
</Page>