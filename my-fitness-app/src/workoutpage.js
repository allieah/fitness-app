import React from "react";
import { Link } from "react-router-dom";
import graph from "./img/graph.png";
import Homeicon from "./img/home.png";
import watch from "./img/watch.png";
import dumbell from "./img/exercise.png";
import firebase from "./firebase";
import logout from "./img/logout.png";
import { Dateauto } from "./data";
import { Greetingauto } from "./data";
import { useEffect } from "react";
import { ref, getDatabase, onValue, set } from "firebase/database";
import { useState } from "react";
import { getAuth } from "firebase/auth";

function Workoutpage(probs) {
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
  // send data to firebase
  const currentUser = getAuth().currentUser; // get the current user from the AuthContext

  const serviceUUID = "e267751a-ae76-11eb-8529-0242ac130003";
  const startCharacteristicUUID = "19b10012-e8f2-537e-4f6c-d104768a1214";
  const pauseCharacteristicUUID = "6995b940-b6f4-11eb-8529-0242ac130003";
  const activityUUID = "00002a19-0000-1000-8000-00805f9b34fb";

  let device;
  let server;
  let service;
  let startCharacteristic;
  let pauseCharacteristic;
  let activityCharacteristic;
  let value;

  let stepsCounter = 0;
  let crunchesCounter = 0;
  let pushupsCounter = 0;
  async function requestDevice() {
    try {
      console.log("Searching For Fitness Band...");

      device = await navigator.bluetooth.requestDevice({
        filters: [{ name: "Fitness-Band" }],
        optionalServices: [serviceUUID],
      });

      console.log("Connected To Fitness Band Successfully!");

      const abortController = new AbortController();

      server = await device.gatt.connect();

      service = await server.getPrimaryService(serviceUUID);

      startCharacteristic = await service.getCharacteristic(
        startCharacteristicUUID
      );
      pauseCharacteristic = await service.getCharacteristic(
        pauseCharacteristicUUID
      );
      activityCharacteristic = await service.getCharacteristic(activityUUID);

      console.log("All Characteristics added successfully!");

      console.log("Watching advertisements from " + device.name + "...");

      device
        .watchAdvertisements({ signal: abortController.signal })
        .catch((error) => {
          console.log("Error: " + error);
        });
    } catch (error) {
      console.log("Failed: " + error);
    }
  }

  function startActivity() {
    var arr = new Int8Array([21, 31]);
    return startCharacteristic.writeValueWithResponse(arr).then((response) => {
      return activityCharacteristic.startNotifications().then((_) => {
        console.log("Started Notifications");
        activityCharacteristic.addEventListener(
          "characteristicvaluechanged",
          function (event) {
            // Call activityDataTransfer function after a delay to ensure that the data is loaded
            setTimeout(function () {
              activityDataTransfer(event);
            }, 500);
          }
        );
      });
    });
  }

  //Function to Stop activity
  function stopActivity() {
    var arr = new Int8Array([21, 31]);
    return pauseCharacteristic.writeValueWithResponse(arr).then((response) => {
      return activityCharacteristic
        .stopNotifications()
        .then((_) => {
          console.log("Stopped Notifications");
        })
        .catch((error) => {
          console.log("Argh! " + error);
        });
    });
  }

  function activityDataTransfer(event) {
    value = event.target.value.getInt8();
    console.log(value);
    if (value == 0) {
      console.log("ideal");
      // stepsCounter = stepsCounter + 1;
      // var elem = document.querySelector("#stepsCount");
      // if (elem) {
      //   elem.innerHTML = stepsCounter;
      // }
    } else if (value == 1) {
      stepsCounter = stepsCounter + 1;
      var elem = document.querySelector("#stepsCount");
      if (elem) {
        elem.innerHTML = stepsCounter;
      }
    }
    // crunchesCounter = crunchesCounter + 1;
    // var elem = document.querySelector("#crunchesCount");
    // if (elem) {
    //   elem.innerHTML = crunchesCounter;
    // }
    // } else if (value == 2) {
    //   pushupsCounter = pushupsCounter + 1;
    //   var elem = document.querySelector("#pushupsCount");
    //   if (elem) {
    //     elem.innerHTML = pushupsCounter;
    //   }
    // }

    console.log("updating firebase");
    console.log("stepscount:", stepscount);
    let steps = stepsCounter + parseInt(stepscount);
    console.log(steps);

    // console.log("pushupscount:", pushupscount);
    let pushups = pushupsCounter + parseInt(pushupscount);
    // console.log(pushups);

    // send data to firebase

    const db = getDatabase();

    // Construct the path to the database location using the user's ID
    const path = `${currentUser.uid}/${currentDay.toLowerCase()}/exercise`;
    set(ref(db, path), {
      stepsCounter: parseInt(steps),
      pushupsCounter: parseInt(pushups),
    });
  }

  const [stepscount, setstepsCount] = useState("");
  const [pushupscount, setPushupsCount] = useState("");
  const database = firebase.database();

  useEffect(() => {
    if (currentUser) {
      const stepsRef = database.ref(`${currentUser.uid}/steps`);
      const pushupsRef = database.ref(`${currentUser.uid}/pushups`);

      const stepsListener = stepsRef.on("value", (snapshot) => {
        const stepsValue = snapshot.val();
        setstepsCount(stepsValue);
      });

      const pushupsListener = pushupsRef.on("value", (snapshot) => {
        const pushupsValue = snapshot.val();
        setPushupsCount(pushupsValue);
      });

      return () => {
        stepsRef.off("value", stepsListener);
        pushupsRef.off("value", pushupsListener);
      };
    }
  }, [currentUser]);

  return (
    <div>
      <div className="header">
        <img src={logout} height="28" width="28" /*onClick={handleSignOut} */ />
        <Dateauto />
        <div></div>
      </div>
      <div id="greeting">
        <Greetingauto />
        <div className="avatar"></div>
      </div>

      <div id="content">
        <div className="box">
          <p className="title">Steps</p>
          <p className="count" id="stepsCount">
            0{" "}
          </p>
        </div>

        <div className="box">
          <p className="title">Heart</p>
          <p className="heart_count count" id="crunchesCount">
            0
          </p>
        </div>

        <div className="box">
          <p className="title">Armcircles</p>
          <p className="count" id="pushupsCount">
            0
          </p>
        </div>

        <div className="box">
          <p className="title">Calories</p>
          <p className="count">0</p>
        </div>
      </div>

      <div className="navbar">
        <button
          className="button"
          id="startBtn"
          onClick={() => startActivity()}
          style={{ width: 100, height: 43 }}
        >
          Start
        </button>
        {/* <!-- Start Button --> */}
        <button
          className="button"
          id="stopBtn"
          onClick={() => stopActivity()}
          style={{ width: 100, height: 43 }}
        >
          Stop
        </button>
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
            <Link to="/charts">
              <img src={graph} height="30" width="30" />
            </Link>
          </div>

          <div className="connect footercontent">
            <img
              src={watch}
              height="30"
              width="30"
              // className="button"
              id="connectBtn"
              onClick={() => requestDevice()}
            />
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Workoutpage;
