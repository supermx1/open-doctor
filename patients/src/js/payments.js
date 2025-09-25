import {f7} from "framework7-svelte";
import {PUBLIC_API_URL} from "../../../config";


export async function payWithPayStack(id, plan){

    try {
        const response = await fetch(`${PUBLIC_API_URL}/flows/trigger/a4aa27ba-bf10-49cf-8579-9c4cc469230f`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: id,
                plan: plan
            })
        });
        return await response.json();
    }
    catch (error) {
        console.error(error);
        f7.toast.create({
            text: 'An error occurred while processing your payment. Please try again later',
            closeTimeout: 2000
        }).open();
    }
}


export async function payWithStripe(id, plan){

    try {
        const response = await fetch(`${PUBLIC_API_URL}/flows/trigger/9b42f3e7-74ce-404c-b928-11ffcb768b44`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                patient_id: id,
                plan: plan
            })
        });
        return await response.json();
    }
    catch (error) {
        console.error(error);
        f7.toast.create({
            text: 'An error occurred while processing your payment. Please try again later',
            closeTimeout: 2000
        }).open();
    }
}