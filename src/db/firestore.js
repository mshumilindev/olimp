import firebase from 'firebase/compat/app';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const config = {
  apiKey: "AIzaSyAP1mtGvLFJGu-LMzwIOJrqabTF3oDKgMw",
  authDomain: "olimp-9ec94.firebaseapp.com",
  databaseURL: "https://olimp-9ec94.firebaseio.com",
  projectId: "olimp-9ec94",
  storageBucket: "gs://olimp-9ec94.appspot.com/",
  messagingSenderId: "454699792786",
  appId: "1:454699792786:web:337b394ecb8c5f5f",
};

const app = firebase.initializeApp(config);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };