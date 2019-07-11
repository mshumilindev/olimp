import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyAP1mtGvLFJGu-LMzwIOJrqabTF3oDKgMw",
    authDomain: "olimp-9ec94.firebaseapp.com",
    databaseURL: "https://olimp-9ec94.firebaseio.com",
    projectId: "olimp-9ec94",
    storageBucket: "gs://olimp-9ec94.appspot.com/",
    messagingSenderId: "454699792786",
    appId: "1:454699792786:web:337b394ecb8c5f5f"
};

firebase.initializeApp(config);

export default firebase;