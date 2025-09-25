<script>

import Icon from "@iconify/svelte";
import NavBar from "@/components/NavBar.svelte";
import {Block, f7, Link, Page, PageContent, Sheet} from "framework7-svelte";
import {today} from "@/js/utils";
import Loading from "@/components/Loading.svelte";
import {client} from "@/js/directus";
import {readItems} from "@directus/sdk";
import Appointment from "@/components/Appointment.svelte";

let loading = true;
let loadingSearch = false;
let appointments;
let pageMessage = "You have no prescriptions issued.";



function openSearch() {
    f7.sheet.open('.search-appointment');
}
</script>

<Page title="Appointments">
    <NavBar title="Appointments">
        <!--            <img slot="icon" src="/img/prescriptions.webp" alt="prescription icon" class="w-4 h-4" />-->
        <Link slot="right" on:click={openSearch}>
            <Icon icon="heroicons:magnifying-glass-20-solid" class="text-primary-600 w-6 h-6"/>
        </Link>
    </NavBar>
<Block>
    <!-- Appointments -->
    <Appointment limit={25}/>
    <!-- Appointments -->
</Block>

</Page>