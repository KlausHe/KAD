import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js"
import {
  getAuth
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js"
import {
  getFirestore
} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"

const FBapp = initializeApp({
  apiKey: "AIzaSyDHgM7J-2Q_W1Swp0Ozx6nY1QDoFcwEFwQ",
  authDomain: "kad-universe.firebaseapp.com",
  databaseURL: "https://kad-universe.firebaseio.com",
  projectId: "kad-universe",
  storageBucket: "kad-universe.appspot.com",
  messagingSenderId: "874702902059",
  appId: "1:874702902059:web:cbe47b5a31e8f57d"
});

const FBauth = getAuth(FBapp);
const FBdb = getFirestore(FBapp);

//check if Userstate changed!
FBauth.onAuthStateChanged((user) => {
  if (user != null) {
    nuncDiscipuli.cred.email = user.email;
    nuncDiscipuli.cred.uid = user.uid;
  } else if (user === null) {
    nuncDiscipuli.cred.email = null;
    nuncDiscipuli.cred.uid = null;
  };
  toggleLayout();
  clearAllTiles();
  setTimeout(() => {
    layoutHideLoadingscreen();
  }, 1000);
});

export function test() {
  return "Penis fickt Muschi"
}