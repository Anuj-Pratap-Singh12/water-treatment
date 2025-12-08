import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function StagePerformanceChart({ localResults }) {
  if (!localResults || !localResults.length) return null;

  const labels = localResults.map((r) => r.label);
  const turbidity = localResults.map((r) => r.turbidity);
  const bod = localResults.map((r) => r.BOD);
  const tn = localResults.map((r) => r.TN);

  const data = {
    labels,
    datasets: [
      {
        label: "Turbidity (NTU)",
        data: turbidity,
        borderColor: "rgb(56, 189, 248)", // sky-400
        backgroundColor: "rgba(56, 189, 248, 0.2)",
        tension: 0.3,
      },
      {
        label: "BOD (mg/L)",
        data: bod,
        borderColor: "rgb(52, 211, 153)", // emerald-400
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        tension: 0.3,
      },
      {
        label: "Total N (mg/L)",
        data: tn,
        borderColor: "rgb(251, 191, 36)", // amber-400
        backgroundColor: "rgba(251, 191, 36, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#64748b" } },
      y: { ticks: { color: "#64748b" } },
    },
  };

  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}

export function ChemicalDoseChart({ doses, chemicalDoses }) {
  const merged = {
    ...(doses || {}),
    ...(chemicalDoses || {}),
  };

  const entries = Object.entries(merged);
  if (!entries.length) return null;

  const labels = entries.map(([k]) => k.replace("_", " "));
  const values = entries.map(([, v]) => v);

  const data = {
    labels,
    datasets: [
      {
        label: "Dose (mg/L)",
        data: values,
        backgroundColor: "rgba(52, 211, 153, 0.6)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: { ticks: { color: "#64748b", autoSkip: false, maxRotation: 45, minRotation: 0 } },
      y: { ticks: { color: "#64748b" } },
    },
  };

  return (
    <div className="h-56">
      <Bar data={data} options={options} />
    </div>
  );
}
