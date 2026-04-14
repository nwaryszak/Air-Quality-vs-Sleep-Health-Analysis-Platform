import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPatients = async () => {
    try {
      const res = await api.get("/patients");
      setPatients(res.data);
    } catch (err) {
      console.error("Błąd pobierania pacjentów:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Na pewno usunąć pacjenta?")) return;
    try {
      await api.delete(`/patients/${id}`);
      fetchPatients();
    } catch (err) {
      alert("Błąd usuwania pacjenta");
    }
  };

  const filteredPatients = patients.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      (p["First Name"]?.toLowerCase().includes(term) ||
      p["Last Name"]?.toLowerCase().includes(term) ||
      (p.Age && p.Age.toString().includes(term)))
    );
  });

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lista pacjentów</h2>
        <Link to="/add-patient" className="btn btn-primary">
          ➕ Dodaj pacjenta
        </Link>
      </div>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Szukaj pacjenta po imieniu, nazwisku lub wieku..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ul className="list-group">
        {filteredPatients.map((p) => (
          <li
            className="list-group-item d-flex justify-content-between align-items-center"
            key={p._id}
          >
            <span>
              {p["First Name"]} {p["Last Name"]} ({p.Age} lat)
            </span>
            <div>
              <Link
                to={`/edit-patient/${p._id}`}
                className="btn btn-sm btn-warning me-2"
              >
                ✏️
              </Link>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDelete(p._id)}
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
