"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { FunnelStepStats } from "@/types/analytics";

interface FunnelStepChartProps {
  steps: FunnelStepStats[];
}

const COLORS = ["#10b981", "#10b981", "#f59e0b", "#f59e0b", "#ef4444"];

export function FunnelStepChart({ steps }: FunnelStepChartProps) {
  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data yet
      </div>
    );
  }

  const data = steps.map((s) => ({
    name: s.step_name,
    reached: s.sessions_reached,
    completed: s.sessions_completed,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          tickLine={false}
          width={160}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
        />
        <Bar dataKey="reached" name="Sessions Reached" radius={[0, 4, 4, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index] || "#6b7280"}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
