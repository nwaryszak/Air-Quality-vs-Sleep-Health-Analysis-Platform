import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AddPatientPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Brak tokenu. Zaloguj się ponownie.");

    try {
      await api.post("/patients", {
        "First Name": firstName,
        "Last Name": lastName,
        Age: Number(age),
      });
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Błąd dodawania pacjenta");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Dodaj pacjenta</h2>
      <form onSubmit={handleAdd} className="mx-auto" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Imię"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nazwisko"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="number"
            className="form-control"
            placeholder="Wiek"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Dodaj</button>
      </form>
    </div>
  );
}
