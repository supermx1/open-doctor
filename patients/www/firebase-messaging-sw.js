

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAXUnSMI5uquvFDGB0CuXvPXurNp0HDNo4",
    authDomain: "telemedicine-app-722d9.firebaseapp.com",
    projectId: "telemedicine-app-722d9",
    storageBucket: "telemedicine-app-722d9.appspot.com",
    messagingSenderId: "956946287292",
    appId: "1:956946287292:web:3a9f48e64ce2c9fdad9eb9",
    measurementId: "G-N0PQ0GWKHM"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

// this is if you wanna do somthing custom,
// otherwise the message is shown anyway

// messaging.onBackgroundMessage((payload) => {
//     console.log(
//         '[firebase-messaging-sw.js] Received background message ',
//         payload
//     );
//     // Customize notification here
//     const notificationTitle = 'Background Message Title';
//     const notificationOptions = {
//         body: 'Background Message body.',
//         icon: '/firebase-logo.png'
//     };
//
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });