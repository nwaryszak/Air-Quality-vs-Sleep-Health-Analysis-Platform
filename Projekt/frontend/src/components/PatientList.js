import React from "react";
import { Link } from "react-router-dom";

function PatientList({ patients }) {
  return React.createElement(
    "table",
    { border: "1" },
    React.createElement(
      "thead",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement("th", null, "Imię"),
        React.createElement("th", null, "Sen (h)"),
        React.createElement("th", null, "Stres"),
        React.createElement("th", null, "Jakość życia"),
        React.createElement("th", null, "Akcje")
      )
    ),
    React.createElement(
      "tbody",
      null,
      patients.map(p =>
        React.createElement(
          "tr",
          { key: p._id },
          React.createElement("td", null, p.name),
          React.createElement("td", null, p.sleepHours),
          React.createElement("td", null, p.stressLevel),
          React.createElement("td", null, p.qualityOfLife),
          React.createElement(
            "td",
            null,
            React.createElement(Link, { to: `/edit-patient/${p._id}` }, "Edytuj")
          )
        )
      )
    )
  );
}

export default PatientList;