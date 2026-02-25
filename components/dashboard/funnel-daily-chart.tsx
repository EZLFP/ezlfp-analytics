"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { FunnelDailyCount } from "@/types/analytics";

interface FunnelDailyChartProps {
  data: FunnelDailyCount[];
}

export function FunnelDailyChart({ data }: FunnelDailyChartProps) {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: d.date.slice(5), // MM-DD
    started: d.started,
    completed: d.completed,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis tick={{ fontSize: 12 }} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="started"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="Started"
        />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name="Completed"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
