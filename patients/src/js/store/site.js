import { readable } from "svelte/store";

export const version = readable("1.0.0");


export const site = readable({
    title: "Open Doctor",
    description: "Open Doctor is a medical app that provides quality healthcare services to its patients",
    logo: "/images/logo.png",
    phone: "+234 803 000 0000",
    email: "",
    version: "1.0.0",
    url: window.location.origin,
    chatServer: "http://127.0.0.1:8090"
});