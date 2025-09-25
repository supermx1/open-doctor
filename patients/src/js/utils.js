import {createAvatar} from '@dicebear/core';
import {initials} from '@dicebear/collection';
import QRCode from 'qrcode';
import {onDestroy} from "svelte";
import {f7} from "framework7-svelte";


export const today = new Date();
export const past = new Date();
past.setFullYear(past.getFullYear() - 18);

export const currency = [
    {
        name: "Naira",
        symbol: "₦",
    },
    {
        name: "US Dollar",
        symbol: "$",
    },
    {
        name: "Euro",
        symbol: "€",
    },
    {
        name: "British Pound",
        symbol: "£",
    },
    {
        name: "Indian Rupee",
        symbol: "₹",
    }
]

export function getCurrencySymbol(symbol) {
    switch (symbol) {
        case "NGN":
            return "₦";
        case "USD":
            return "$";
        case "EUR":
            return "€";
        case "GBP":
            return "£";
    }
}

export function generateSVGAvatar(name) {
    return createAvatar(initials, {
        seed: name,
        radius: 50,
    }).toDataUri();
}

export function formatDate(dt) {
    const date = new Date(dt);
    return date.toLocaleString('default', {month: '2-digit', year: '2-digit'});
}

export function formatDateDay(dt) {
    const date = new Date(dt);
    return date.toLocaleString('default', {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
//format time from this format 12:33:00
export function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const date = new Date(2000, 0, 1, hours, minutes); // Use a fixed date (Jan 1, 2000)
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}



// export function ISOFormat(dt) {
//     const date = new Date(dt);
//     const y = date.getFullYear();
//     const m = date.getMonth() + 1;
//     const d = date.getDate();
//     return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
// }
// export function formatDateDayMonth(dt) {
//     const date = new Date(dt);
//     return date.toLocaleDateString('default', {day: "numeric", month: 'long'});
// }
//
export function formatDateExt(dt) {
    const date = new Date(dt);
    return date.toLocaleDateString("en-NG", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
}

export function formatCurrencyExt(amount) {
    return new Intl.NumberFormat().format(amount);
}

export function timeOfDayGreeting(){
    const hour = new Date().getHours();
    if(hour >= 0 && hour < 12) {
        return 'Good morning';
    } else if(hour >= 12 && hour < 16) {
        return 'Good afternoon';
    } else {
        return 'Good evening';
    }
}

export function copy(text, message) {
    navigator.clipboard.writeText(text);
    f7.toast.create({
        text: message || "Copied to clipboard",
        position: "bottom",
        closeTimeout: 2000,
        cssClass: "bg-blue",
    }).open();
}


export function getDayMonth(dt) {
    const date = new Date(dt);
    return {
        day: date.toLocaleDateString('default', {day: "numeric"}),
        month: date.toLocaleDateString('default', {month: 'short'})
    }
}


export async function generateQRCode(data) {
    return QRCode.toString(data, {
        errorCorrectionLevel: 'H',
        type: 'svg',
        margin: 1,
        color: {}
    });
}

// calculate age
export function calculateAge(birthday) {
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

//Framework7 has a bug that doesn't allow the navbar to be removed from the DOM when the page doesn't have a navbar if your navigate
//from a page with a navbar to a page without a navbar. This function removes the navbar from the DOM when the page doesn't have a navbar
export function removeNavbar() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                const element = document.querySelector(".navbars.navbar-hidden");
                if (element) {
                    element.remove();
                }
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    onDestroy(() => {
        observer.disconnect();
    });
}


// function to check if a time is within a range
export function isTimeBetween(startTime, endTime, checkTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const check = new Date(`2000-01-01T${checkTime}`);
    return check >= start && check <= end;
}

// function that takes a timestamp with this format 2025-03-11T14:00:41.000Z and compares it to current timestamp and returns boolean
export function isPast(timestamp) {
    return new Date(timestamp) < new Date();
}

export function sortByDate(array){
    return array.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });
}
