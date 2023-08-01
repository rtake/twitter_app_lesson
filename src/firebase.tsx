import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFURgUCFqWic487ZIUS1YX_48L0snRp8I",
  authDomain: "twitter-app-af299.firebaseapp.com",
  projectId: "twitter-app-af299",
  storageBucket: "twitter-app-af299.appspot.com",
  messagingSenderId: "797577634723",
  appId: "1:797577634723:web:fcdbc921cae2c001aab016",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const db = firebaseApp.firestore();
export const auth = firebaseApp.auth();
export const storage = firebaseApp.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
