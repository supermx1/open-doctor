import {createDirectus, rest, graphql, authentication, readItems, realtime, updateItem, readMe} from '@directus/sdk';
import {f7} from "framework7-svelte";
import {PATIENT_DATA} from "@/js/store/user";
import {PLANS} from "@/js/store/plan";
import { PUBLIC_API_URL } from "../../../config"

class SessionStorage {
  get() {
    return JSON.parse(sessionStorage.getItem("opendoctor"));
  }
  set(data) {
    sessionStorage.setItem("opendoctor", JSON.stringify(data));
  }
}

const storage = new SessionStorage();

export const client = createDirectus(PUBLIC_API_URL)
    // .with(authentication('cookie', {
    //     credentials: 'include',
    //     storage: storage }))
    // .with(graphql({ credentials: 'include' }))
    // .with(rest({ credentials: 'include' }))
    .with(authentication('json',{ storage: storage }))
    .with(rest())
    .with(realtime());


export async function getMe() {
  try {
    return await client.request(
        readMe({
          fields: ['*'],
        })
    );
  } catch (error) {
    console.error("Failed to fetch user details:", error);
  }
}


export async function getMyDetails() {
  try {
    const _d = await client.request(readItems('patients', {
      fields: ['*'],
    }));
    PATIENT_DATA.set(_d[0]);
  } catch (error) {
    f7.toast.create({
      text: "Failed to fetch user details",
      position: "bottom",
      closeTimeout: 2000,
      cssClass: "bg-red",
    }).open();
    console.error("Failed to fetch user details:", error);
  }
}

export async function getPlans() {
  try {
    const _d = await client.request(readItems('plan', {
      fields: ['*'],
      filter: {
        status: { _eq: 'active' }
        }
    }));
    PLANS.set(_d);
  } catch (error) {
    f7.toast.create({
      text: "Failed to fetch plans",
      position: "bottom",
      closeTimeout: 2000,
      cssClass: "bg-red",
    }).open();
    console.error("Failed to fetch plans:", error);
  }
}

export async function updateLocation(id, data) {
  try {
    await client.request(
        updateItem('patients', id, {
            location: data
        })
    );
  } catch (error) {
    console.error("Failed to update location:", error);
  }
}
