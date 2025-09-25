
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAXUnSMI5uquvFDGB0CuXvPXurNp0HDNo4",
    authDomain: "telemedicine-app-722d9.firebaseapp.com",
    projectId: "telemedicine-app-722d9",
    storageBucket: "telemedicine-app-722d9.appspot.com",
    messagingSenderId: "956946287292",
    appId: "1:956946287292:web:3a9f48e64ce2c9fdad9eb9",
    measurementId: "G-N0PQ0GWKHM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const messaging = getMessaging(app);


export async function requestPermission() {
    Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                // console.log('Notification permission granted.');
                getToken(messaging, { vapidKey: 'BOuVmFB9QJmegHoAAKlIyvBYGG9QL3Y3FjjXY7y22xRPMZNK7WvhLBKXl7VAusGX7qjz22kU0lbEL-Wt8ES_nLU'}).then((currentToken) => {
                    localStorage.setItem('fcm_token', currentToken);
                }).catch((err) => {
                    console.log('An error occurred while retrieving token. ', err);
                });
            }

            // console.log(permission)
        }
    );
}