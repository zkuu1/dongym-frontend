"use client";

import { graphicStat } from "@/types/interface";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function CustomerStatsChart({
  customers,
}: {
  customers: graphicStat[];
}) {
  // 1. Group customers by createdAt date
  const groupByDate = customers.reduce((acc: Record<string, number>, c) => {
    if (!c.createdAt) return acc;

    let dateString = "";

    // IF createdAt is string
    if (typeof c.createdAt === "string") {
      dateString = c.createdAt.split("T")[0];
    }

    // IF createdAt is a Date object
    else if (c.createdAt instanceof Date) {
      dateString = c.createdAt.toISOString().split("T")[0];
    }

    if (!dateString) return acc;

    acc[dateString] = (acc[dateString] || 0) + 1;

    return acc;
  }, {});

  // 2. Convert object → array
  const chartData = Object.entries(groupByDate).map(([date, count]) => ({
    date,
    count,
  }));

  // 3. Sort by date
  chartData.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Customer Growth Chart
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

    
      <p className="text-sm text-gray-600 mt-3">
        Grafik ini menampilkan pertumbuhan customer berdasarkan jumlah pendaftaran
        baru setiap harinya.
      </p>
    </div>

    
  );
}
