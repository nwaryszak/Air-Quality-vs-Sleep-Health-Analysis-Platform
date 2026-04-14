import React, { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer
  // LineChart,
  // Line,
} from 'recharts';

function Charts() {
  const [patients, setPatients] = useState([]);
  const [analysisData, setAnalysisData] = useState([]);
  const [cityAir, setCityAir] = useState([]);
  const [villageAir, setVillageAir] = useState([]);
  const [stressAirData, setStressAirData] = useState([]);
  const [heartAirData, setHeartAirData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/data/patients')
      .then(res => res.json())
      .then(setPatients)
      .catch(err => console.error('Błąd ładowania danych pacjentów:', err));

    fetch('http://localhost:5000/api/analysis/sleep-vs-air')
      .then(res => res.json())
      .then(setAnalysisData)
      .catch(err => console.error('Błąd ładowania danych analizy snu:', err));

    fetch('http://localhost:5000/api/air/city')
      .then(res => res.json())
      .then(setCityAir)
      .catch(err => console.error('Błąd danych powietrza - miasto:', err));

    fetch('http://localhost:5000/api/air/village')
      .then(res => res.json())
      .then(setVillageAir)
      .catch(err => console.error('Błąd danych powietrza - wieś:', err));

    fetch('http://localhost:5000/api/analysis/stress-vs-air')
      .then(res => res.json())
      .then(setStressAirData)
      .catch(err => console.error('Błąd ładowania danych stres-vs-air:', err));

    fetch('http://localhost:5000/api/analysis/heart-vs-air')
      .then(res => res.json())
      .then(setHeartAirData)
      .catch(err => console.error('Błąd ładowania danych heart-vs-air:', err));
  }, []);

  const calculateAverages = (data) => {
    const grouped = {};
    data.forEach(entry => {
      const param = entry.parameter;
      if (!grouped[param]) grouped[param] = [];
      grouped[param].push(entry.value);
    });

    return Object.keys(grouped).map(param => {
      const values = grouped[param];
      const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
      return { parameter: param, avgValue: parseFloat(avg.toFixed(2)) };
    });
  };

  const cityAverages = calculateAverages(cityAir);
  const villageAverages = calculateAverages(villageAir);

  const combinedAirData = cityAverages.map(cityParam => {
    const villageParam = villageAverages.find(v => v.parameter === cityParam.parameter);
    return {
      parameter: cityParam.parameter,
      cityAvg: cityParam.avgValue,
      villageAvg: villageParam ? villageParam.avgValue : 0,
    };
  });

  return (
    <div style={{ padding: '1rem', fontFamily: 'Arial, sans-serif' }}>
      <h3>Sen vs Jakość snu</h3>
      <ScatterChart width={520} height={320} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="Sleep Duration" name="Sen (h)"
          label={{ value: 'Sen (h)', position: 'insideBottomRight', offset: -10 }}
          domain={['dataMin - 1', 'dataMax + 1']} />
        <YAxis type="number" dataKey="Quality of Sleep" name="Jakość snu"
          label={{ value: 'Jakość snu', angle: -90, position: 'insideLeft' }}
          domain={[0, 10]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" height={36} />
        <Scatter name="Pacjenci" data={patients} fill="#8884d8" />
      </ScatterChart>

      <h3>Sen vs Poziom stresu</h3>
      <ScatterChart width={520} height={320} margin={{ top: 20, right: 20, bottom: 20, left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" dataKey="Sleep Duration" name="Sen (h)"
          label={{ value: 'Sen (h)', position: 'insideBottomRight', offset: -10 }}
          domain={['dataMin - 1', 'dataMax + 1']} />
        <YAxis type="number" dataKey="Stress Level" name="Poziom stresu"
          label={{ value: 'Poziom stresu', angle: -90, position: 'insideLeft' }}
          domain={[0, 10]} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend verticalAlign="top" height={36} />
        <Scatter name="Pacjenci" data={patients} fill="#82ca9d" />
      </ScatterChart>

      <h3>Jakość powietrza vs Jakość snu</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={analysisData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend 
            formatter={value => value === 'airPollution' ? 'Jakość powietrza (im wyższa, tym gorsza)' : value} 
          />
          <Bar dataKey="airPollution" name="Jakość powietrza" fill="#ff7300" />
          <Bar dataKey="avgSleepQuality" name="Średnia jakość snu" fill="#387908" />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#555', marginTop: '-1rem', marginBottom: '1rem' }}>
        Wyższe wartości jakości powietrza oznaczają gorsze zanieczyszczenie.
      </p>

      <h3>Jakość powietrza vs Średni poziom stresu</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={stressAirData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend 
            formatter={value => value === 'airPollution' ? 'Jakość powietrza (im wyższa, tym gorsza)' : value} 
          />
          <Bar dataKey="airPollution" name="Jakość powietrza" fill="#ffc658" />
          <Bar dataKey="avgStressLevel" name="Poziom stresu" fill="#ff7f50" />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#555', marginTop: '-1rem', marginBottom: '1rem' }}>
        Wyższe wartości jakości powietrza oznaczają gorsze zanieczyszczenie.
      </p>

      <h3>Jakość powietrza vs Średnie tętno</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={heartAirData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip />
          <Legend 
            formatter={value => value === 'airPollution' ? 'Jakość powietrza (im wyższa, tym gorsza)' : value} 
          />
          <Bar dataKey="airPollution" name="Jakość powietrza" fill="#8884d8" />
          <Bar dataKey="avgHeartRate" name="Tętno" fill="#ff4444" />
        </BarChart>
      </ResponsiveContainer>
      <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#555', marginTop: '-1rem', marginBottom: '1rem' }}>
        Wyższe wartości jakości powietrza oznaczają gorsze zanieczyszczenie.
      </p>

      {/* <h3>Średni poziom zanieczyszczeń – Miasto</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={cityAverages} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="parameter" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgValue" fill="#8884d8" name="Średnia wartość" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Średni poziom zanieczyszczeń – Wieś</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={villageAverages} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="parameter" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="avgValue" fill="#82ca9d" name="Średnia wartość" />
        </BarChart>
      </ResponsiveContainer>

      <h3>Porównanie jakości powietrza – Miasto vs Wieś</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={combinedAirData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="parameter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cityAvg" fill="#8884d8" name="Miasto" />
          <Bar dataKey="villageAvg" fill="#82ca9d" name="Wieś" />
        </BarChart>
      </ResponsiveContainer> */}

      <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#333' }}>
        <h3>Co oznaczają poszczególne parametry zanieczyszczeń powietrza?</h3>
        {/* <ul>
          <li><strong>bc</strong> – black carbon (cząsteczki sadzy). Wyższe wartości oznaczają więcej sadzy w powietrzu, co jest szkodliwe dla zdrowia.</li>
          <li><strong>no0</strong> – tlenek azotu (NO). Wyższe wartości wskazują na większe zanieczyszczenie gazami spalinowymi.</li>
        </ul> */}
        <p style={{ fontStyle: 'italic', color: '#555' }}>
          Generalnie wyższe wartości tych parametrów oznaczają gorszą jakość powietrza i większe ryzyko dla zdrowia.
        </p>
      </div>
    </div>
  );
}

export default Charts;
