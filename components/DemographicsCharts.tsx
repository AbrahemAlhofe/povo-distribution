"use client";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Line } from "recharts";
import type { DemographicsData } from "../lib/airtable";
import Lineicons from "@lineiconshq/react-lineicons";
import { UserMultiple4Bulk, UserMultiple4Solid } from "@lineiconshq/free-icons";

interface DemographicsChartsProps {
  data?: DemographicsData;
}

export default function DemographicsCharts({ data }: DemographicsChartsProps) {
  if (!data) {
    return null;
  }

  // Prepare gender data for pie chart
  const genderData = [
    { name: "ذكور", value: data.genderDistribution.male },
    { name: "إناث", value: data.genderDistribution.female },
  ];

  // Prepare age data for bar chart
  const ageData = [
    { name: "18-24", value: data.ageDistribution["18-24"] },
    { name: "25-34", value: data.ageDistribution["25-34"] },
    { name: "35-44", value: data.ageDistribution["35-44"] },
  ];

  const GENDER_COLORS = ["#3b82f6", "#10b981"];
  const AGE_COLOR = "#f59e0b";

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 mb-8">
      {/* Gender Distribution Pie Chart */}
      <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">توزيع الجنس</h3>
          <span className="text-sm text-zinc-400">👤</span>
        </div>
        <div className="flex justify-center mb-4">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6">
          {genderData.map((item, index) => (
            <div key={item.name} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: GENDER_COLORS[index] }}
              />
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {item.value}% {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Age Distribution Bar Chart */}
      <div className="w-full rounded-xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">الفئات العمرية</h3>
          <span className="text-sm text-zinc-400">
            <Lineicons icon={UserMultiple4Bulk} className="text-lg" />
          </span>
        </div>
        <BarChart
          data={ageData}
          width={"100%"}
          height={300}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        > 
          <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: "12px" }} />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            width={10}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              color: "#000000",
            }}
            formatter={(value) => `${value}%`}
          />
          <Bar dataKey="value" fill={AGE_COLOR} radius={[8, 8, 0, 0]} />
        </BarChart>
      </div>
    </div>
  );
}
