import Chart from "chart.js/auto";
import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import firebase from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import graph from "./img/graph.png";
import Homeicon from "./img/home.png";
import watch from "./img/watch.png";
import dumbell from "./img/exercise.png";

function ExerciseChart() {
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

  const [exerciseData, setExerciseData] = useState(null);
  const db = getDatabase();
  const path = `${currentUser?.uid}/${currentDay.toLowerCase()}/exercise`;

  useEffect(() => {
    const exerciseRef = ref(db, path);
    onValue(exerciseRef, (snapshot) => {
      setExerciseData(snapshot.val());
    });
  }, [db, path]);

  useEffect(() => {
    if (exerciseData) {
      const chartData = {
        labels: ["Steps", "Pushups"],
        datasets: [
          {
            label: "Exercise Data",
            data: [exerciseData.stepsCounter, exerciseData.pushupsCounter],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)", // background color for the first element
              "rgba(54, 162, 235, 0.2)", // background color for the second element
            ],
            borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)"],
            borderWidth: 1,
          },
        ],
      };

      const chartConfig = {
        type: "bar",
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                display: false,
              },
            },
          },
        },
      };

      const chartCanvas = document.getElementById("exercise-chart");

      if (chartCanvas) {
        new Chart(chartCanvas, chartConfig);
      }
    }
  }, [exerciseData]);

  return (
    <div>
      <div>
        <canvas
          id="exercise-chart"
          width="400"
          height="400"
          style={{
            backgroundColor: "white",
            margin: 20,
            marginTop: 150,
            borderRadius: 20,
          }}
        ></canvas>
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

export default ExerciseChart;
