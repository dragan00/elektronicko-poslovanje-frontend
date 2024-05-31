import firebase from "firebase/app";
import "firebase/messaging";

const config = {
  apiKey: "AIzaSyDEyvlFOL9lyrNW3az9qr4ePkppXObBc0g",
  authDomain: "transport-ddd18.firebaseapp.com",
  projectId: "transport-ddd18",
  storageBucket: "transport-ddd18.appspot.com",
  messagingSenderId: "458892100965",
  appId: "1:458892100965:web:a351ff9aea413e186c0d8c",
  measurementId: "G-NWXYYM80CV",
};

let messaging = {};

if ("Notification" in window) {
  console.log("PUSH SUPPORTED");
  firebase.initializeApp(config);

  messaging = firebase.messaging();
} else {
  console.log("Obavijesti nisu podržane operacijskim sustavom");
}

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);  
    });
  });
