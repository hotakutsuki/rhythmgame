import firebase from 'firebase/app'
import 'firebase/firestore'
const firebaseConfig = {
    apiKey: "AIzaSyC99wuPPcUpZI6fs339isim3iF26i6DkdY",
    authDomain: "rhythm-tunnel-46485.firebaseapp.com",
    projectId: "rhythm-tunnel-46485",
    storageBucket: "rhythm-tunnel-46485.appspot.com",
    messagingSenderId: "563772088651",
    appId: "1:563772088651:web:b75c1d5b47fd16adce88ce",
    measurementId: "G-SR19BC3LWW"
  };

  firebase.initializeApp(firebaseConfig)

  export default firebase