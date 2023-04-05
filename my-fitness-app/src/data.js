import React, { useEffect, useState } from "react";
import SignUp from "./SignUp";
const Days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const Months = [
  "JANURAY",
  "FEBRUARY",
  "MARCH",
  "APRIAL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUsT",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
export function Dateauto() {
  const [displayDate, setDisplayDate] = useState("");

  useEffect(() => {
    const d = new Date();
    const currentDay = Days[d.getDay()];
    const currentDate = d.getDate();
    const currentMonth = Months[d.getMonth()];
    const dateStr = currentDay + " , " + currentDate + " " + currentMonth;
    setDisplayDate(dateStr);
  }, []);
  return (
    <>
      <p id="date" style={{ marginTop: 5 }}>
        {displayDate}
      </p>
    </>
  );
}

export function Greetingauto({ userName }) {
  const [greeting, setGreeting] = useState("");
  useEffect(() => {
    const d = new Date();
    const timeNow = d.getHours();
    // console.log(userName);
    // console.log("userName");
    const greeting =
      timeNow >= 5 && timeNow < 12
        ? "Good Morning"
        : timeNow >= 12 && timeNow < 15
        ? "Good Afternoon"
        : "Good evening";
    setGreeting(greeting);
  }, []);
  return (
    <>
      <p>
        {greeting}
        <br />
      </p>
    </>
  );
}
