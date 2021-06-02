import firebase from "firebase";
require("@firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyDAHaBf-SbyN9Jjz0v0kCxFm6OL-5HBr-M",
  authDomain: "online-grocery-app-49d0f.firebaseapp.com",
  projectId: "online-grocery-app-49d0f",
  storageBucket: "online-grocery-app-49d0f.appspot.com",
  messagingSenderId: "95843127932",
  appId: "1:95843127932:web:ce7238befebb917d8a2ff9"
};
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();