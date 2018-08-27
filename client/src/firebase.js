// Initialize Firebase
import firebase from 'firebase'

var config = {
    apiKey: "AIzaSyDq7OZHZIUJ0D59aOzgjI4pcoiz5_ZgSQk",
    authDomain: "leafs-prospects.firebaseapp.com",
    databaseURL: "https://leafs-prospects.firebaseio.com",
    projectId: "leafs-prospects",
    storageBucket: "leafs-prospects.appspot.com",
    messagingSenderId: "623837291963"
};
firebase.initializeApp(config);
export default firebase;