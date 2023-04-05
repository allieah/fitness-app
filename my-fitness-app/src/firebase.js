import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import { useEffect, useState } from "react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
firebase.initializeApp({
  apiKey: "AIzaSyAGXetBSdnw6vwg6YftJmhfYombC1q5ltA",
  authDomain: "fitness-63f57.firebaseapp.com",
  databaseURL: "https://fitness-63f57-default-rtdb.firebaseio.com",
  projectId: "fitness-63f57",
  storageBucket: "fitness-63f57.appspot.com",
  messagingSenderId: "691218369167",
  appId: "1:691218369167:web:afa8abda4abbb40d737efa",
});
// Initialize Firebase
const auth = getAuth();
const storage = getStorage();
// Custom Hook
export function useAuth() {
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setCurrentUser(user));
    return unsub;
  }, []);

  return currentUser;
}

// Storage
export async function uploadFile(file, currentUser, setLoading) {
  const fileRef = ref(storage, currentUser.uid + ".png");

  setLoading(true);

  const snapshot = await uploadBytes(fileRef, file);
  const photoURL = await getDownloadURL(fileRef);

  updateProfile(currentUser, {
    photoURL,
  });

  setLoading(false);
  alert("Uploaded file!");
}
export default firebase;
