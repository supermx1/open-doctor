<script>
    import {Page} from "framework7-svelte";
    import Loading from "../components/Loading.svelte";
</script>

<Page>
    <div class="h-screen flex align-items-center justify-content-center">
        <div class="flex flex-col items-center gap-2 text-lg">
            <img src="/img/logo.png" alt="logo" class="!w-12 !h-12 animate-bounce"/>
<!--            <Loading color={"text-black !w-8 !h-8"}/>-->
            loading...
        </div>

    </div>
</Page>


