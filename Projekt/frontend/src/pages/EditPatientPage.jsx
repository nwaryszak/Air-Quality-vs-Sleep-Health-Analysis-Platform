import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

export default function EditPatientPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get(`/patients/${id}`);
        setFirstName(res.data["First Name"]);
        setLastName(res.data["Last Name"]);
        setAge(res.data.Age);
      } catch (err) {
        alert("Błąd wczytywania danych");
      }
    };
    fetchPatient();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/patients/${id}`, {
        "First Name": firstName,
        "Last Name": lastName,
        Age: age,
      });
      navigate("/dashboard");
    } catch (err) {
      alert("Błąd aktualizacji pacjenta");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>Edytuj pacjenta</h2>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          placeholder="Imię"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Nazwisko"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <br />
        <input
          type="number"
          placeholder="Wiek"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
        />
        <br />
        <button type="submit">Zapisz zmiany</button>
      </form>
    </div>
  );
}