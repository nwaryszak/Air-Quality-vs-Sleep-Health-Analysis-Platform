import React, { useState } from "react";
import api from "../services/api";

export default function AddMeasurementPage({ type }) {
  const [locationId, setLocationId] = useState("");
  const [locationName, setLocationName] = useState("");
  const [parameter, setParameter] = useState("");
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!locationId || !locationName || !parameter || !value || !unit) {
      alert("Wypełnij wszystkie pola");
      return;
    }

    setLoading(true);
    try {
      await api.post(`/air/${type}`, {
        location_id: locationId,
        location_name: locationName,
        parameter,
        value: parseFloat(value), 
        unit,
        datetimeUtc: new Date().toISOString(),
        datetimeLocal: new Date().toISOString(),
        timezone: "Europe/Warsaw",
        latitude: "",
        longitude: "",
        country_iso: "",
        isMobile: "",
        isMonitor: "",
        owner_name: "",
        provider: "",
      });
      alert("Dodano pomiar");

      // Reset formularza po sukcesie:
      setLocationId("");
      setLocationName("");
      setParameter("");
      setValue("");
      setUnit("");
    } catch (err) {
      console.error(err);
      alert("Błąd dodawania pomiaru: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAdd} style={{ maxWidth: 400, margin: "auto" }}>
      <input
        type="text"
        placeholder="Location ID"
        value={locationId}
        onChange={(e) => setLocationId(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Location Name"
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Parameter"
        value={parameter}
        onChange={(e) => setParameter(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        required
        step="any" 
      />
      <input
        type="text"
        placeholder="Unit"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Dodaję..." : "Dodaj pomiar"}
      </button>
    </form>
  );
}
