import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "Jan", reuse: 72 },
  { name: "Feb", reuse: 76 },
  { name: "Mar", reuse: 79 },
  { name: "Apr", reuse: 83 },
  { name: "May", reuse: 88 },
  { name: "Jun", reuse: 91 },
];

export default function WaterUsageChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "#0e7490" }} />
        <YAxis tick={{ fill: "#0e7490" }} />
        <Tooltip />
        <Bar dataKey="reuse" fill="#06b6d4" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
