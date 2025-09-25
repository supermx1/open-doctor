import {writable} from "svelte/store";


export const notificationCount = writable(0);
export const notifications = writable([]);
export const lastUpdated = writable("");