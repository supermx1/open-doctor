import {
  createDirectus,
  rest,
  authentication,
  readItems,
  realtime,
  readItem,
  readNotifications,
  updateItem,
  readMe
} from '@directus/sdk';
import { notificationCount, lastUpdated, notifications } from '$lib/js/store/notification.js';

import {DOCTOR_DATA, USER} from "$lib/js/store/user";

import { toast } from "svelte-sonner";
import { goto } from '$app/navigation';

class SessionStorage {
  get() {
    return JSON.parse(sessionStorage.getItem("sandsclinic"));
  }
  set(data) {
    sessionStorage.setItem("sandsclinic", JSON.stringify(data));
  }
}

const storage = new SessionStorage();

export const client = createDirectus('https://sandsclinic.91.99.84.16.nip.io')
    .with(authentication('json',{ storage: storage }))
    .with(rest())
    .with(realtime());



export async function getMyDetails(id) {
  try {
    const _d = await client.request(readItems('doctor', {
      fields: ['*.*'],
      filter: {
        doctor_user: {
          _eq: id
        }
      }
    }));
    DOCTOR_DATA.set(_d[0]);
  } catch (error) {
    toast.error("Failed to fetch user details");
    console.error("Failed to fetch user details:", error);
  }
}


//TODO: Handle error
export async function getAppointments(id, limit = 10) {
    return await client.request(
      readItems('appointment', {
        sort: ['date'],
        limit: limit,
        fields: ['*.*', 'assigned_doctor.*'],
        filter: {
          _and: [ {
            status: {
              _eq: 'pending'
            }
          },{
          assigned_doctor: {
            _eq: id
          }
          }
          ]
        }
      })
    );
}

export async function getAppointment(id) {
  try {
    return await client.request(readItem('appointment', id, {
      fields: ['*.*', 'assigned_doctor.*']
    }));
  }
  catch (error) {
    console.error("Failed to fetch appointment details:", error);
  }
}

export async function getMedicalRecords() {
  try {
    return await client.request(readItems('medical_record', {
      fields: ['*.*'],
      sort: ['-date_created']
    }));
  }
  catch (error) {
    console.error("Failed to fetch medical records:", error);
  }
}

export async function getNotifications() {
  try {
    const n  =  await client.request(
      readNotifications({
        filter: {
          status: {
            _eq: "inbox"
          }
        },
        fields: ['*'],
        sort: ['-timestamp'],
        limit: 20,
      })
    );
    notificationCount.set(n.length);
    notifications.set(n);
    lastUpdated.set(new Date());
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
  }
}



export async function logout() {
  await client.logout();
  sessionStorage.removeItem('sandsclinic');
  USER.set(null);
  await goto('/login');
}


export async function updateProfile(id, data) {
  try {
    const d = await client.request(
      updateItem('doctor', id, data)
    );
      await getMyDetails();
      toast.success("Profile updated successfully");
    return d;
  } catch (error) {
    console.error(error);
    toast.error("Failed to update profile: " + error.errors[0].message);
  }
}


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
