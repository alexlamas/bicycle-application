import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyA0RTnkq5i3Ap2K8WYJnNukyWjNCXH9oOY",
  authDomain: "bicycle-1.firebaseapp.com",
  databaseURL: "https://bicycle-1.firebaseio.com",
  projectId: "bicycle-1",
  storageBucket: "gs://bicycle-1.appspot.com/",
  messagingSenderId: "992141165877",
  appId: "1:992141165877:web:65fc951234e76cb851b87c",
  measurementId: "G-VH6EMTN7XT"
};
firebase.initializeApp(config);
let db = firebase.database();
let auth = firebase.auth();
let storage = firebase.storage();

export { db, auth, storage };
