import { useEffect, useState } from "react";
import api from "../services/api";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Błąd pobierania pacjentów:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <p>Ładowanie pacjentów...</p>;

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p["Person ID"]?.toString().toLowerCase().includes(term) ||
      p.PersonID?.toString().toLowerCase().includes(term) ||
      p._id?.toString().toLowerCase().includes(term)) ||
      (p["First Name"]?.toLowerCase().includes(term) ||
      p.firstName?.toLowerCase().includes(term)) ||
      (p["Last Name"]?.toLowerCase().includes(term) ||
      p.lastName?.toLowerCase().includes(term))
    );
  });

  return (
    <div className="container my-4">
      <h2 className="mb-4 border-bottom pb-2">Lista Pacjentów</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Szukaj pacjenta po ID, imieniu lub nazwisku..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <button className="btn btn-outline-primary mb-3" onClick={fetchPatients}>
        Odśwież listę
      </button>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-primary">
            <tr>
              <th style={{ width: "60px" }}>ID</th>
              <th style={{ width: "150px" }}>Imię</th>
              <th style={{ width: "150px" }}>Nazwisko</th>
              <th>Płeć</th>
              <th>Wiek</th>
              <th>Zawód</th>
              <th>Czas snu (h)</th>
              <th>Jakość snu</th>
              <th>Aktywność fizyczna</th>
              <th>Poziom stresu</th>
              <th>Kategoria BMI</th>
              <th>Ciśnienie krwi</th>
              <th>HR</th>
              <th>Lokalizacja</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => (
              <tr key={p._id || p["Person ID"] || p.PersonID}>
                <td>{p["Person ID"] || p.PersonID || p._id || "-"}</td>
                <td>{p["First Name"] || p.firstName || "-"}</td>
                <td>{p["Last Name"] || p.lastName || "-"}</td>
                <td>{p.Gender || p.gender || "-"}</td>
                <td>{p.Age || p.age || "-"}</td>
                <td>{p.Occupation || p.occupation || "-"}</td>
                <td>{p["Sleep Duration"] || p.sleepDuration || "-"}</td>
                <td>{p["Quality of Sleep"] || p.qualityOfSleep || "-"}</td>
                <td>{p["Physical Activity Level"] || p.physicalActivityLevel || "-"}</td>
                <td>{p["Stress Level"] || p.stressLevel || "-"}</td>
                <td>{p["BMI Category"] || p.bmiCategory || "-"}</td>
                <td>{p["Blood Pressure"] || p.bloodPressure || "-"}</td>
                <td>{p["Heart Rate"] || p.HeartRate || p.heartRate || "-"}</td>
                <td>{p.Location || p.location || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
