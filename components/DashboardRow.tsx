"use client";

import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { IndicatorCard } from "./IndicatorCard";
import type { DashboardMetrics } from "../lib/metrics";
import { Lineicons } from "@lineiconshq/react-lineicons";
import { BarChartDollarSolid, Headphone1Solid, Book1Solid, StarFatHalf2Solid } from "@lineiconshq/free-icons";
import { Session } from "@/lib/types";

type MetricKey = "revenues" | "listening" | "books" | "rating";

export default function DashboardRow({ session, metrics }: { session: Session | null, metrics: DashboardMetrics }) {
  const [selected, setSelected] = useState<MetricKey | null>("revenues");

  const handleHover = (key: MetricKey | null) => () => setSelected(key);

  const labels = metrics.labels || [];

  const getSeries = (key: MetricKey) => {
    switch (key) {
      case "revenues":
        return metrics.revenuesSeries || [];
      case "listening":
        return metrics.listeningMinutesSeries || [];
      case "books":
        return metrics.uploadedBooksSeries || [];
      case "rating":
        return metrics.ratingSeries || [];
    }
  };

  const selectedSeries = selected ? getSeries(selected) : [];

  // Transform series data for Recharts
  const chartData = selectedSeries.map((value, index) => ({
    name: labels[index] || `Day ${index + 1}`,
    value: value,
  }));

  const selectedLabel = selected ? { revenues: "إجمالي الإيرادات", listening: "عدد دقائق الاستماع", books: "إجمالي الكتب المرفوعة", rating: "متوسط التقييم العام" }[selected] : "الاتجاه";

  return (
    <div className="w-full">
      <div className="mb-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <h1 className="text-4xl">
          أهلاً
          <b> {session?.name}</b>
        </h1>
      </div>
      <div className="mb-6 flex flex-row gap-6">
        <IndicatorCard
          label="إجمالي الإيرادات"
          value={`$${metrics.totalRevenues.toLocaleString("en-US")}`}
          icon={<Lineicons icon={BarChartDollarSolid} className="text-2xl text-green-500" />}
          changePercent={metrics.revenuesChange}
          onHover={handleHover("revenues")}
        />
        <IndicatorCard
          label="عدد دقائق الاستماع"
          value={metrics.totalListeningMinutes.toLocaleString("en-US")}
          icon={<Lineicons icon={Headphone1Solid} className="text-2xl text-blue-500" />}
          changePercent={metrics.listeningMinutesChange}
          onHover={handleHover("listening")}
        />
        <IndicatorCard
          label="إجمالي الكتب المرفوعة"
          value={metrics.uploadedBooksCount}
          icon={<Lineicons icon={Book1Solid} className="text-2xl text-indigo-500" />}
          changePercent={metrics.uploadedBooksChange}
          onHover={handleHover("books")}
        />
        {/* <IndicatorCard
          label="متوسط التقييم العام"
          value={metrics.averageRating}
          icon={<Lineicons icon={StarFatHalf2Solid} className="text-2xl text-yellow-400" />}
          changePercent={metrics.ratingChange}
          onHover={handleHover("rating")}
        /> */}
      </div>

      {/* Chart window */}
      <div className="w-full rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400">{selectedLabel}</div>
          <div className="text-xs text-zinc-400 dark:text-zinc-500">{labels[0] || ""} — {labels[labels.length - 1] || ""}</div>
        </div>
        <BarChart
          data={chartData}
          width={"100%"}
          height={300}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              color: "#000000",
            }}
            cursor={{ fill: "rgba(96, 165, 250, 0.1)" }}
          />
          <Bar dataKey="value" fill="#60a5fa" radius={[8, 8, 0, 0]} />
          <XAxis
            dataKey="name"
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
          />
          <YAxis
            stroke="#9ca3af"
            style={{ fontSize: "12px" }}
            width={10}
          />
        </BarChart>
      </div>
    </div>
  );
}
