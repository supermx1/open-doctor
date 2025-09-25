<script>

    import {Block, Button, f7, Link, Page, Segmented} from "framework7-svelte";
    import NavBar from "@/components/NavBar.svelte";
    import {PLANS} from "@/js/store/plan";
    import Icon from "@iconify/svelte";
    import {formatDateDay, getCurrencySymbol, isPast} from "@/js/utils";
    import {PATIENT_DATA} from "@/js/store/user";
    import Loading from "@/components/Loading.svelte";
    import {payWithPayStack, payWithStripe} from "@/js/payments";

    let activeStrongButton = 0;
    let selectedPlan = null;
    let selectedPlanObject = null;
    let loading = false;

    let showIframe = false;
    let iFrameUrl = "";

    $: console.log(selectedPlanObject);

    function filterPlans(type) {
        return $PLANS.filter((plan) => plan.type === type);
    }

    function filterPlanById(id) {
        return $PLANS.find((plan) => plan.id === id);
    }

    async function subscribe() {
        loading = true;
        if (!selectedPlan) {
            f7.dialog.alert("Please select a plan to subscribe");
            return;
        }
        try {
            if(selectedPlanObject.type === "individual" || selectedPlanObject.type === "family") {
                const _r = await payWithPayStack( $PATIENT_DATA.id, selectedPlan);
                if(_r) {
                    console.log(_r);
                    loading = false;
                    // window.location.href = _r.data.data.authorization_url;
                    showIframe = true;
                    iFrameUrl = _r.data.data.authorization_url;
                }
            } else {
                const _r = await payWithStripe( $PATIENT_DATA.id, selectedPlan);
                if(_r) {
                    console.log(_r);
                    loading = false;
                    window.location.href = _r.data.url;
                }
            }

        } catch (error) {
            console.error(error);
        } finally {
            loading = false;
        }
    }

</script>


<Page name="subscription">
    <NavBar title="Subscription Plans"/>
    {#if isPast($PATIENT_DATA?.plan_expiry) && !$PATIENT_DATA?.plan}
    <Block>
        <p class="mb-3">Our available subscriptions plans are:</p>
        <Segmented strong tag="p">
            <Button active={activeStrongButton === 0} onClick={() => (activeStrongButton = 0)}
            >Individual
            </Button
            >
            <Button active={activeStrongButton === 1} onClick={() => (activeStrongButton = 1)}
            >Family
            </Button
            >
            <Button active={activeStrongButton === 2} onClick={() => (activeStrongButton = 2)}
            >International
            </Button
            >
        </Segmented>

        {#if activeStrongButton === 0}
            <ul class="grid w-full gap-3 grid-cols-2 md:grid-cols-2 mt-4">
            {#each filterPlans("individual") as plan, i}
                <li class="col-span-2 relative">
                    <input
                            on:change={() => (selectedPlanObject = plan)}
                            bind:group={selectedPlan}
                            type="radio"
                            id={plan.id}
                            name="plan"
                            value={plan.id}
                            class="!hidden peer"
                            required
                    />
                    <Icon icon="heroicons:check-circle-solid" class="absolute right-4 top-5 text-transparent peer-checked:inline-block peer-checked:!text-primary-600 w-6 h-6" />
                    <label for={plan.id}
                           class="radio-label peer-checked:bg-primary-100 pb-4 !pl-6 peer-checked:border-primary-700 peer-checked:border-transparent peer-checked:text-primary-600 peer-checked:ring-2 ring-primary-600">
                        <div>
                            <div class="w-full text-base">{plan.name} <span class="capitalize">({plan.type} Plan)</span></div>
                            <div class="w-full text-2xl font-bold">{getCurrencySymbol(plan.currency)}{Number(plan.price).toFixed(0)}</div>
                            <Link class="flex items-center justify-start">
                                Plan info
                                <Icon icon="heroicons:chevron-right-20-solid" class="mt-0.5"  />
                            </Link>
<!--                            <ul class="text-sm">-->
<!--                            {#each plan.features as feature}-->
<!--                                <li class="ml-4">• {feature.description}</li>-->
<!--                            {/each}-->
<!--                            </ul>-->
                        </div>
                    </label>
                </li>
            {/each}
            </ul>
        {/if}
        {#if activeStrongButton === 1}
            <ul class="grid w-full gap-3 grid-cols-2 md:grid-cols-2 mt-4">
            {#each filterPlans("family") as plan}
                <li class="col-span-2 relative">
                    <input
                            on:change={() => (selectedPlanObject = plan)}
                            bind:group={selectedPlan}
                            type="radio"
                            id={plan.id}
                            name="plan"
                            value={plan.id}
                            class="!hidden peer"
                            required
                    />
                    <Icon icon="heroicons:check-circle-solid" class="absolute right-4 top-5 text-transparent peer-checked:inline-block peer-checked:!text-primary-600 w-6 h-6" />
                    <label for={plan.id}
                           class="radio-label peer-checked:bg-primary-100 pb-4 !pl-6 peer-checked:border-primary-700 peer-checked:border-transparent peer-checked:text-primary-600 peer-checked:ring-2 ring-primary-600">
                        <div>
                            <div class="w-full text-base">{plan.name} <span class="capitalize">({plan.type} Plan)</span></div>
                            <div class="w-full text-2xl font-bold">{getCurrencySymbol(plan.currency)}{Number(plan.price).toFixed(0)}</div>
                            <!--                            <ul class="text-sm">-->
                            <!--                            {#each plan.features as feature}-->
                            <!--                                <li class="ml-4">• {feature.description}</li>-->
                            <!--                            {/each}-->
                            <!--                            </ul>-->
                        </div>
                    </label>
                </li>
            {/each}
            </ul>
        {/if}
        {#if activeStrongButton === 2}
            <ul class="grid w-full gap-3 grid-cols-2 md:grid-cols-2 mt-4">
            {#each filterPlans("international") as plan}
                <li class="col-span-2 relative">
                    <input
                            on:change={() => (selectedPlanObject = plan)}
                            bind:group={selectedPlan}
                            type="radio"
                            id={plan.id}
                            name="plan"
                            value={plan.id}
                            class="!hidden peer"
                            required
                    />
                    <Icon icon="heroicons:check-circle-solid" class="absolute right-4 top-5 text-transparent peer-checked:inline-block peer-checked:!text-primary-600 w-6 h-6" />
                    <label for={plan.id}
                           class="radio-label peer-checked:bg-primary-100 pb-4 !pl-6 peer-checked:border-primary-700 peer-checked:border-transparent peer-checked:text-primary-600 peer-checked:ring-2 ring-primary-600">
                        <div>
                            <div class="w-full text-base">{plan.name} <span class="capitalize">({plan.type} Plan)</span></div>
                            <div class="w-full text-2xl font-bold">{getCurrencySymbol(plan.currency)}{Number(plan.price).toFixed(2)}</div>
                        </div>
                    </label>
                </li>
            {/each}
            </ul>
        {/if}

    </Block>
    <div class=" absolute !z-[9999] left-1/2 bottom-28 transform -translate-x-1/2 w-[90%]">
        <button disabled={!selectedPlan} type="button" on:click={subscribe}
                class="disabled:opacity-80 disabled:cursor-not-allowed flex items-center justify-center text-base w-full bg-primary-500 text-white font-medium rounded-lg py-4">
            {#if loading}
                <Loading color="text-white"/>
            {:else}
                Subscribe
            {/if}
        </button>
    </div>
    <iframe src={iFrameUrl} class:!inline-block={showIframe} class="hidden w-full h-full fixed top-0 left-0 z-[999999]" frameborder="0"></iframe>
        {:else}
    <Block>
        <p class="mb-3">You have an active subscription plan:</p>
        {#if $PATIENT_DATA}
            <div class="w-full bg-primary-500 text-white p-4 rounded-lg">
                <div class="flex justify-between">
                    <div>
                        <h1 class="text-lg font-bold">{filterPlanById($PATIENT_DATA?.plan).name}</h1>
                        <p class="text-sm">{
                            filterPlanById($PATIENT_DATA?.plan).type === "individual" ? "Individual Plan" :
                                filterPlanById($PATIENT_DATA?.plan).type === "family" ? "Family Plan" :
                                    filterPlanById($PATIENT_DATA?.plan).type === "international" ? "International Plan" : ""
                        }</p>
                    </div>
                    <div>
                        <p class="text-sm">Expiry: {formatDateDay($PATIENT_DATA?.plan_expiry)}</p>
                    </div>
                </div>
            </div>

        {/if}
    </Block>
    {/if}
</Page>
