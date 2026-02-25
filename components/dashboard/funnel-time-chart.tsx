"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FunnelStepStats } from "@/types/analytics";

interface FunnelTimeChartProps {
  steps: FunnelStepStats[];
}

export function FunnelTimeChart({ steps }: FunnelTimeChartProps) {
  if (!steps.length) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground">
        No data yet
      </div>
    );
  }

  const data = steps.map((s) => ({
    name: `Step ${s.step_number}`,
    fullName: s.step_name,
    seconds: s.avg_time_seconds,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          tickFormatter={(v) => `${v}s`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "0.5rem",
          }}
          formatter={(value, _name, props) => [
            `${value}s`,
            (props as { payload: { fullName: string } }).payload.fullName,
          ]}
        />
        <Bar dataKey="seconds" name="Avg Time" fill="#115F9A" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
