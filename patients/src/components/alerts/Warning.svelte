<script>
    import Icon from "@iconify/svelte";

    export let title = "Warning";
    export let message = "Your purchase has been declined.";
</script>

<div class="bg-yellow-50 border-s-4 border-yellow-500 p-4" role="alert">
    <div class="flex">
        <div class="shrink-0">
            <!-- Icon -->
            <span class="inline-flex justify-center items-center size-8 rounded-full border-4 border-yellow-100 bg-yellow-200 text-yellow-800">
                <Icon icon="ph:warning" class="shrink-0 size-4" />
            </span>
            <!-- End Icon -->
        </div>
        <div class="ms-3">
            <h3 id="hs-bordered-red-style-label" class="text-gray-800 font-semibold">
                {title}
            </h3>
            <p class="text-sm text-gray-700">
                {message}
            </p>
        </div>
    </div>
</div>