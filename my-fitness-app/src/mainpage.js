import React, { useEffect, useState, useLayoutEffect } from "react";
import { Link } from "react-router-dom";
import graph from "./img/graph.png";
import Homeicon from "./img/home.png";
import watch from "./img/watch.png";
import dumbell from "./img/exercise.png";
import logout from "./img/logout.png";
import Profile from "./profilr";
import firebase from "./firebase";
import { useNavigate } from "react-router-dom";
import "firebase/compat/auth";
import { Dateauto } from "./data";
import { Greetingauto } from "./data";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function Mainpage() {
  const d = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const currentDay = days[d.getDay()];
  const [signedIn, setSignedIn] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [stepsCounter, setstepsCounter] = useState(0);
  const [pushupsCounter, setpushupsCounter] = useState(0);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  console.log("Current user:", currentUser);
  const db = getDatabase();

  // Check if user is signed in before accessing their uid
  useEffect(() => {
    if (!currentUser) {
      return;
    }

    const fetchData = async () => {
      const path = `${currentUser.uid}/${currentDay.toLowerCase()}/exercise`;
      try {
        const snapshot = await get(ref(db, path));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setstepsCounter(data.stepsCounter);
          setpushupsCounter(data.pushupsCounter);
          console.log(data);
          console.log(data.stepsCounter);
          // console.log(data.pushupsCounter);
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to get exercise data!");
      }
    };

    fetchData();
  }, [currentUser]);

  // useEffect(() => {
  //   const updateLocalStorage = async () => {
  //     const lungeselement = document.querySelector("#lungesCounter");
  //     console.log(lungeselement);
  //     if (lungeselement !== null) {
  //       const innerHTMLValue = lungeselement.textContent;
  //       console.log(innerHTMLValue);
  //       localStorage.setItem("lungescount", innerHTMLValue);
  //     } else {
  //       console.log("Element not found");
  //     }
  //   };

  //   updateLocalStorage();
  // }, [lungesCounter]);

  // useEffect(() => {
  //   const updateLocalStorage = async () => {
  //     const pushupselement = document.querySelector("#pushupscounter");
  //     console.log(pushupselement);
  //     if (pushupselement !== null) {
  //       const innerHTMLValue = pushupselement.textContent;
  //       console.log(innerHTMLValue);
  //       localStorage.setItem("pushupscount", innerHTMLValue);
  //     } else {
  //       console.log("Element not found");
  //     }
  //   };

  //   updateLocalStorage();
  // }, [pushupsCounter]);

  // useEffect(() => {
  //   const updateLocalStorage = async () => {
  //     const lungesElement = document.querySelector("#lungesCounter");
  //     console.log(lungesElement);
  //     const pushupsElement = document.querySelector("#pushupsCounter");
  //     console.log(pushupsElement);

  //     // Check if data is available on Firebase before updating localStorage
  //     if (lungesCounter !== null && lungesElement !== null) {
  //       const innerHTMLValue = lungesElement.textContent;
  //       console.log("lunges:", innerHTMLValue);
  //     }

  //     if (pushupsCounter !== null && pushupsElement !== null) {
  //       const innerHTMLValue = pushupsElement.textContent;
  //       console.log("pushups:", innerHTMLValue);
  //     }
  //   };

  //   updateLocalStorage();
  // }, [lungesCounter, pushupsCounter]);
  const database = firebase.database();
  useEffect(() => {
    const updateFirebase = async () => {
      const stepsElement = document.querySelector("#stepsCounter");
      console.log(stepsElement);
      const pushupsElement = document.querySelector("#pushupsCounter");
      // console.log(pushupsElement);

      if (currentUser && stepsCounter !== null && stepsElement !== null) {
        const innerHTMLValue = stepsElement.textContent;
        console.log("steps:", innerHTMLValue);
        database.ref(`${currentUser.uid}/steps`).set(innerHTMLValue);
      }

      if (currentUser && pushupsCounter !== null && pushupsElement !== null) {
        const innerHTMLValue = pushupsElement.textContent;
        console.log("pushups:", innerHTMLValue);
        database.ref(`${currentUser.uid}/pushups`).set(innerHTMLValue);
      }
    };

    updateFirebase();
  }, [currentUser, stepsCounter, pushupsCounter]);

  //signout
  const handleSignOut = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          firebase
            .database()
            .ref("users/" + user.uid)
            .update({
              signedIn: false, // Set the signedIn property to false
            });
          setSignedIn(false); // Update the state in your component
          navigate("/"); // Redirect the user to the login page after signing out
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("No user signed in.");
    }
  };

  let navigate = useNavigate();
  return (
    <div>
      <div className="header">
        <img src={logout} height="28" width="28" onClick={handleSignOut} />
        <Dateauto />
        <div></div>
      </div>

      <div id="greeting">
        <Greetingauto />
        <div>
          <Profile />
        </div>
      </div>

      <div id="content">
        <div className="box">
          <p className="title">Steps</p>
          <p className="count" id="stepsCounter">
            {stepsCounter}
          </p>
        </div>

        <div className="box">
          <p className="title">Heart</p>
          <p className="count" id="crunchesCounter">
            0
          </p>
        </div>

        <div className="box">
          <p className="title">Armcircles</p>
          <p className="count " id="pushupsCounter">
            {/* {pushupsCounter} */}0
          </p>
        </div>

        <div className="box">
          <p className="title">Calories</p>
          <p className="count">0</p>
        </div>
      </div>

      <div className="footer">
        <nav className="nav">
          <div className="home footercontent">
            <Link to="/mainpage">
              {" "}
              <img src={Homeicon} height="30" width="30" />
            </Link>
          </div>

          <div className="startworkout footercontent">
            <Link to="/workputpage">
              {" "}
              <img src={dumbell} height="40" width="40" />
            </Link>
          </div>
          <div className=" footercontent">
            <img
              src={graph}
              height="30"
              width="30"
              className="sign_out"
              // onClick={handleSignOut}
            />
          </div>
          <div className="connect footercontent">
            <img src={watch} height="30" width="30" />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Mainpage;
