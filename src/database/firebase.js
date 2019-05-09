import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// Initialize Firebase1
let config = {
  apiKey: "AIzaSyDcRYHMADxcObTL30AgVNNrwg9nCvreEHs",
  authDomain: "connector-smajke.firebaseapp.com",
  databaseURL: "https://connector-smajke.firebaseio.com",
  projectId: "connector-smajke",
  storageBucket: "connector-smajke.appspot.com",
  messagingSenderId: "353877942680"
};
firebase.initializeApp(config);

export default firebase;
export const ref = firebase.database().ref();
export const auth = firebase.auth;
export const provider = new firebase.auth.FacebookAuthProvider();
