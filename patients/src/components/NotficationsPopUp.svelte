<script>

import Icon from "@iconify/svelte";
import {f7, Block, Link, Navbar, NavRight, Page, Popup} from "framework7-svelte";
import {client} from "@/js/directus";
import {readItems, readNotifications} from "@directus/sdk";
import {PATIENT_DATA} from "@/js/store/user";
import {onMount} from "svelte";
import {formatDateExt} from "@/js/utils";
import {notificationCount} from "@/js/store/notification";
import RelativeTime from "svelte-relative-time";
import {quintOut} from "svelte/easing";
import {slide} from "svelte/transition";

let notifications = [];
$: notification = null;
let lastUpdated;

async function getNotifications() {
    try {
        notifications =  await client.request(
            readNotifications({
                filter: {
                   status: {
                          _eq: "inbox"
                   }
                },
                fields: ['*'],
                limit: 20,
            })
        );
        $notificationCount = notifications.length;
        lastUpdated = new Date();
    } catch (error) {
        console.error("Failed to fetch notifications:", error);
    }
}

function openNotification(index) {
    notification = notifications[index];
    f7.popup.open('.notification');

}

onMount(async () => {
    await getNotifications();
});

</script>


<Popup class="notifications">
    <Page>
        <Navbar title="Notifications" class="custom-navbar print:hidden">
            <NavRight>
                <Link popupClose>
                    <Icon icon="heroicons:x-mark-20-solid" class="h-6 w-6 text-zinc-800"/>
                </Link>
            </NavRight>
        </Navbar>

        {#if notification === null}
        <div class="list media-list list-outline-ios list-strong-ios list-dividers-ios">
            <ul>
                {#if notifications && notifications.length > 0}
                {#each notifications as notification, i}
                <li>
                    <a on:click={()=> openNotification(i)} href="#" class="item-link item-content">
                        <div class="item-inner">
                            <div class="item-title-row">
                                <div class="item-title truncate flex gap-1 items-center">
                                    {#if notification.collection !== null}
                                        ⚠️
                                    {/if}
                                    {notification.subject}
                                </div>
                                <div class="item-after">{formatDateExt(notification.timestamp)}</div>
                            </div>
                            <div class="item-subtitle">{notification.subject}</div>
                            <div class="item-text">{@html notification.message}</div>
                        </div>
                    </a>
                </li>
                {/each}
                {:else}
                <li>
                    <div class="block">
                        <p class="text-center">No notifications</p>
                    </div>
                </li>
                {/if}
            </ul>
        </div>
            {:else}
            <div class="block" in:slide={{ y: 200, easing: quintOut, axis: 'y', opacity: 0.5  }}>
                <p class="text-lg font-bold">
                    {#if notification.collection !== null}
                        ⚠️
                    {/if}
                    {notification.subject}
                </p>
                <p class="text-xs text-muted">{formatDateExt(notification.timestamp)}</p>
                <p class="my-6">{@html notification.message}</p>

                <Link on:click={()=> notification = null} class=" text-primary-600 flex justify-center">Close</Link>
            </div>
        {/if}

        <div class="absolute !z-[9999] left-1/2 bottom-8 transform -translate-x-1/2 w-auto">
            {#if lastUpdated}
            <p class="text-[0.7rem] border border-zinc-100 rounded-full px-3 py-1 bg-zinc-200">
                Last updated: <RelativeTime live={true} date={lastUpdated} locale="en"/>
            </p>
            {/if}
        </div>
    </Page>
</Popup>