// Initialize Firebase
import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDF4dlLgWelez92pEEh6yemAbLd9-B4QkY",
    authDomain: "leaf-aggregator.firebaseapp.com",
    databaseURL: "https://leaf-aggregator.firebaseio.com",
    projectId: "leaf-aggregator",
    storageBucket: "leaf-aggregator.appspot.com",
    messagingSenderId: "454209898947"
};
firebase.initializeApp(config);
export default firebase;

// test comment