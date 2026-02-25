"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import type { FunnelRecentSession } from "@/types/analytics";

const STEP_NAMES: Record<number, string> = {
  0: "—",
  1: "Discord Auth",
  2: "Riot Account",
  3: "Playstyle",
  4: "Communication",
  5: "Goals",
};

type SortKey = "started_at" | "max_step_reached" | "duration_seconds" | "event_count";

interface FunnelSessionsTableProps {
  sessions: FunnelRecentSession[];
}

export function FunnelSessionsTable({ sessions }: FunnelSessionsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortAsc, setSortAsc] = useState(false);

  if (!sessions.length) {
    return (
      <p className="text-sm text-muted-foreground py-4">No sessions recorded yet</p>
    );
  }

  const sorted = [...sessions].sort((a, b) => {
    let cmp: number;
    if (sortKey === "started_at") {
      cmp = a.started_at.localeCompare(b.started_at);
    } else {
      cmp = (a[sortKey] as number) - (b[sortKey] as number);
    }
    return sortAsc ? cmp : -cmp;
  });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ArrowUpDown className="h-3 w-3 inline ml-1 opacity-40" />;
    return sortAsc
      ? <ArrowUp className="h-3 w-3 inline ml-1" />
      : <ArrowDown className="h-3 w-3 inline ml-1" />;
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left p-3 font-medium text-muted-foreground">Session</th>
            <th className="text-left p-3 font-medium text-muted-foreground">Discord</th>
            <th
              className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => toggleSort("started_at")}
            >
              Started <SortIcon col="started_at" />
            </th>
            <th
              className="text-left p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => toggleSort("max_step_reached")}
            >
              Last Step <SortIcon col="max_step_reached" />
            </th>
            <th className="text-center p-3 font-medium text-muted-foreground">Status</th>
            <th
              className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => toggleSort("duration_seconds")}
            >
              Duration <SortIcon col="duration_seconds" />
            </th>
            <th
              className="text-right p-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground"
              onClick={() => toggleSort("event_count")}
            >
              Events <SortIcon col="event_count" />
            </th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((s, i) => (
            <tr
              key={s.session_id}
              className={`hover:bg-muted/50 ${i % 2 === 0 ? "bg-muted/20" : ""}`}
            >
              <td className="p-3 font-mono text-xs">{s.session_id}</td>
              <td className="p-3 text-xs text-muted-foreground">
                {s.discord_id || "—"}
              </td>
              <td className="p-3 text-xs">
                {formatDistanceToNow(new Date(s.started_at), { addSuffix: true })}
              </td>
              <td className="p-3">
                <span className="text-xs">
                  {STEP_NAMES[s.max_step_reached] || `Step ${s.max_step_reached}`}
                </span>
              </td>
              <td className="p-3 text-center">
                {s.completed ? (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500">
                    Completed
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-500/10 text-amber-500">
                    Dropped
                  </span>
                )}
              </td>
              <td className="p-3 text-right text-xs">
                {formatDuration(s.duration_seconds)}
              </td>
              <td className="p-3 text-right">{s.event_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
