// AirQualityChart.js
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AirQualityChart({ data }) {

  const sortedData = [...data].sort(
    (a, b) => new Date(a.datetimeUtc) - new Date(b.datetimeUtc)
  );

  const chartData = {
    labels: sortedData.map((d) =>
      new Date(d.datetimeUtc).toLocaleString("pl-PL", {
        hour: "2-digit",
        minute: "2-digit",
        day: "numeric",
        month: "numeric",
      })
    ),
    datasets: [
      {
        label: sortedData.length > 0 ? sortedData[0].parameter : "Parametr",
        data: sortedData.map((d) => d.value),
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Wykres jakości powietrza",
      },
    },
  };

  return <Line data={chartData} options={options} />;
}
