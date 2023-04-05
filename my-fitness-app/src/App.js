import "./App.css";
import "./style.css";
import "./pp1.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import SignIn from "./Signin";
import Firstpage from "./firstpage";
import SignUp from "./SignUp";
import Mainpage from "./mainpage";
import firebase from "firebase/compat/app";
import { initializeApp } from "firebase/app";
import { useNavigate } from "react-router-dom";
import Workoutpage from "./workoutpage";
import { createRoot } from "react-dom/client";
import ResetPassword from "./reset";
import ExerciseChart from "./charts";
// use createRoot() here

const firebaseConfig = {
  apiKey: "AIzaSyAGXetBSdnw6vwg6YftJmhfYombC1q5ltA",
  authDomain: "fitness-63f57.firebaseapp.com",
  databaseURL: "https://fitness-63f57-default-rtdb.firebaseio.com",
  projectId: "fitness-63f57",
  storageBucket: "fitness-63f57.appspot.com",
  messagingSenderId: "691218369167",
  appId: "1:691218369167:web:afa8abda4abbb40d737efa",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };

function App() {
  let navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  //for signup
  let registrationHandler = (event, email, password) => {
    event.preventDefault();
    const auth = getAuth(app);
    return createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(userCredential);

        setErrorMessage("sucessful logIn"); // clear any previous error message
        navigate("/mainpage"); // navigate to the main page
        return true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        alert("Error signing in with Google");
        setErrorMessage(errorMessage); // set the error message in state

        return false;
      });
  };

  //for login page

  let loginHandler = (event, email, password) => {
    event.preventDefault();
    const auth = getAuth(app);
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        return true; // return true if login is successful
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setErrorMessage(errorMessage);
        return false; // return false if login fails
      });
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Firstpage />} />
        <Route path="/LogIn" element={<SignIn login={loginHandler} />} />
        <Route
          path="/SignUp"
          element={
            <SignUp
              message={errorMessage}
              register={registrationHandler}
              errorMessage={errorMessage}
            />
          }
        />
        <Route path="/charts" element={<ExerciseChart />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/mainpage" element={<Mainpage />} />
        <Route path="/workputpage" element={<Workoutpage />} />
      </Routes>
    </div>
  );
}

export default App;
