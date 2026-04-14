import React, { useEffect, useState } from "react";
import api from "../services/api";
import AirQualityChart from "../components/AirQualityChart";

export default function AirQualityPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState("city");

  const [error, setError] = useState(null);


  const [form, setForm] = useState({
    location_id: "",
    location_name: "",
    parameter: "",
    value: "",
    unit: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchData(selected);
    resetForm();
    setEditingId(null);
  }, [selected]);

  const fetchData = async (type) => {
    try {
      setError(null);
      const res = await api.get(`/air/${type}`);
      setData(res.data);
    } catch (err) {
      console.error("Błąd pobierania danych:", err);
      setError("Nie udało się pobrać danych.");
      setData([]);
    }
  };

  const resetForm = () => {
    setForm({
      location_id: "",
      location_name: "",
      parameter: "",
      value: "",
      unit: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { location_id, location_name, parameter, value, unit } = form;
    if (!location_id || !location_name || !parameter || !value || !unit) {
      alert("Wypełnij wszystkie pola");
      return;
    }

    try {
      const payload = {
        ...form,
        value: parseFloat(value),
        datetimeUtc: new Date().toISOString(),
        datetimeLocal: new Date().toISOString(),
      };

      if (editingId) {
        await api.put(`/air/${selected}/${editingId}`, payload);
        alert("Pomiar zaktualizowany");
      } else {
        await api.post(`/air/${selected}`, payload);
        alert("Pomiar dodany");
      }
      fetchData(selected);
      resetForm();
      setEditingId(null);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas zapisu pomiaru");
    }
  };

  const handleEdit = (entry) => {
    setForm({
      location_id: entry.location_id,
      location_name: entry.location_name,
      parameter: entry.parameter,
      value: entry.value,
      unit: entry.unit,
    });
    setEditingId(entry.location_id);
  };

  const handleDelete = async (location_id) => {
    if (!window.confirm("Na pewno usunąć pomiar?")) return;

    try {
      await api.delete(`/air/${selected}/${location_id}`);
      alert("Pomiar usunięty");
      fetchData(selected);
    } catch (err) {
      console.error(err);
      alert("Błąd podczas usuwania");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Dane jakości powietrza</h2>

      <div className="btn-group my-3">
        <button
          className={`btn btn-${selected === "village" ? "primary" : "outline-primary"}`}
          onClick={() => setSelected("village")}
        >
          Wieś
        </button>
        <button
          className={`btn btn-${selected === "city" ? "primary" : "outline-primary"}`}
          onClick={() => setSelected("city")}
        >
          Miasto
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Location ID"
          name="location_id"
          value={form.location_id}
          onChange={handleChange}
          disabled={!!editingId}
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Location Name"
          name="location_name"
          value={form.location_name}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          type="text"
          placeholder="Parameter"
          name="parameter"
          value={form.parameter}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />
        <input
          type="number"
          placeholder="Value"
          name="value"
          value={form.value}
          onChange={handleChange}
          required
          className="form-control mb-2"
          step="any"
        />
        <input
          type="text"
          placeholder="Unit"
          name="unit"
          value={form.unit}
          onChange={handleChange}
          required
          className="form-control mb-2"
        />

        <button type="submit" className="btn btn-success">
          {editingId ? "Zapisz zmiany" : "Dodaj pomiar"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              resetForm();
              setEditingId(null);
            }}
            className="btn btn-secondary ms-2"
          >
            Anuluj
          </button>
        )}
      </form>

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Data</th>
            <th>Lokalizacja</th>
            <th>Parametr</th>
            <th>Wartość</th>
            <th>Jednostka</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {data.length ? (
            data.map((entry) => (
              <tr key={entry.location_id}>
                <td>{new Date(entry.datetimeUtc).toLocaleString()}</td>
                <td>{entry.location_name}</td>
                <td>{entry.parameter}</td>
                <td>{entry.value}</td>
                <td>{entry.unit}</td>
                <td>
                  <button
                    className="btn btn-sm btn-primary me-2"
                    onClick={() => handleEdit(entry)}
                  >
                    Edytuj
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(entry.location_id)}
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                Brak danych
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {data.length > 0 && <AirQualityChart data={data} />}
    </div>
  );
}
