import { readable } from "svelte/store";


export const site = readable({
		title: "Sandsclinic",
		description: "Sandsclinic is a medical facility that provides quality healthcare services to its patients",
		logo: "/images/logo.png",
		phone: "+234 803 000 0000",
		email: "",
		version: "1.0.0",
		url: "https://localhost:5173",
		chatServer: "http://127.0.0.1:8090"
});