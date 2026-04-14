import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Błąd logowania:", err.response ? err.response.data : err.message);
      alert("Nieprawidłowe dane logowania");
    }
  };

  return React.createElement(
    "div",
    { style: { textAlign: "center", marginTop: 40 } },
    React.createElement("h2", null, "Logowanie"),
    React.createElement(
      "form",
      { onSubmit: handleLogin },
      React.createElement("input", {
        type: "email",
        placeholder: "Email",
        value: email,
        onChange: (e) => setEmail(e.target.value),
        required: true,
      }),
      React.createElement("br"),
      React.createElement("input", {
        type: "password",
        placeholder: "Hasło",
        value: password,
        onChange: (e) => setPassword(e.target.value),
        required: true,
      }),
      React.createElement("br"),
      React.createElement("button", { type: "submit" }, "Zaloguj się")
    )
  );
}

export default LoginPage;