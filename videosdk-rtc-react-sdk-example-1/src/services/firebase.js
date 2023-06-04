import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  onChildChanged,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDwGjq4uOC4zH-SEENqj9lnLXfVuudzmEs",
  authDomain: "trackmylearn-5c4d8.firebaseapp.com",
  projectId: "trackmylearn-5c4d8",
  storageBucket: "trackmylearn-5c4d8.appspot.com",
  messagingSenderId: "334406400012",
  appId: "1:334406400012:web:74b464fbada123ffba9629",
  measurementId: "G-322RZQPV4M",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const logInWithEmailAndPassword = async (email, password) => {
  if (auth.currentUser) return;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  if (auth.currentUser) return;
  try {
    await createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        const user = userCredential.user;
        set(ref(db, "users/" + user.uid), {
          name: name,
          email: email,
          uid: user.uid,
          courses: [],
          type: "student",
        });
      }
    );
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  if (!auth.currentUser) return;
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const user = auth.currentUser;

export {
  auth,
  user,
  db,
  ref,
  set,
  update,
  get,
  onChildChanged,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
};
