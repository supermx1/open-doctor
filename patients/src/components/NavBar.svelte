<script>
import Icon from "@iconify/svelte";
import {Link, Navbar, NavLeft, NavRight, NavTitle} from "framework7-svelte";
import {show} from "dom7";

export let title = "";

export let showLeft = true;

export let showClose = false;
</script>

<Navbar class="custom-navbar" sliding="false">
    {#if showLeft}
    <NavLeft>
        <Link back>
            <Icon icon="heroicons:arrow-left-20-solid"  class="text-zinc-800 h-6 w-6" />
        </Link>
    </NavLeft>
    {/if}
    {#if showClose}
        <NavLeft>
            <Link href="/">
                <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6 text-zinc-800" />
            </Link>
        </NavLeft>
    {/if}
    <NavTitle class="!flex !items-center gap-2">
        <slot name="icon"/>
        {title}
    </NavTitle>
    <NavRight>
        <slot name="right"/>
    </NavRight>
</Navbar>