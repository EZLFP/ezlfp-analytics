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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FunnelStepStats } from "@/types/analytics";

interface FunnelDropoffSectionProps {
  steps: FunnelStepStats[];
}

export function FunnelDropoffSection({ steps }: FunnelDropoffSectionProps) {
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
    rate: s.drop_off_rate,
    count: s.drop_off_count,
  }));

  const worst = steps.reduce(
    (max, s) => (s.drop_off_rate > max.drop_off_rate ? s : max),
    steps[0]
  );

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              formatter={(value, _name, props) => [
                `${value}% (${(props as { payload: { count: number } }).payload.count} users)`,
                (props as { payload: { fullName: string } }).payload.fullName,
              ]}
            />
            <Bar dataKey="rate" name="Drop-off Rate" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <Card className="border-red-500/30 bg-red-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Biggest Drop-off
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-red-500">
            {worst.drop_off_rate}%
          </div>
          <p className="text-sm font-medium mt-1">
            Step {worst.step_number}: {worst.step_name}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {worst.drop_off_count} users dropped off at this step
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
