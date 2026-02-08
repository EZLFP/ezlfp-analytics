"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/stat-card";
import type { BotGuild, GuildsResponse } from "@/types/analytics";
import { ArrowUpDown, ArrowUp, ArrowDown, Server, Users, Shield } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";

interface GuildsTableProps {
  data: GuildsResponse;
}

type SortKey = "name" | "memberCount" | "joinedAt";
type SortDirection = "asc" | "desc";

function GuildIcon({ guild }: { guild: BotGuild }) {
  if (guild.iconHash) {
    return (
      <img
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.iconHash}.png?size=32`}
        alt={guild.name}
        width={32}
        height={32}
        className="rounded-full"
      />
    );
  }

  const initials = guild.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
      {initials}
    </div>
  );
}

export function GuildsTable({ data }: GuildsTableProps) {
  const { guilds, summary } = data;
  const [sortKey, setSortKey] = useState<SortKey>("joinedAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const sortedGuilds = [...guilds].sort((a, b) => {
    const modifier = sortDirection === "asc" ? 1 : -1;

    if (sortKey === "name") {
      return a.name.localeCompare(b.name) * modifier;
    }
    if (sortKey === "memberCount") {
      return (a.memberCount - b.memberCount) * modifier;
    }
    // joinedAt
    return (new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()) * modifier;
  });

  const SortIcon = ({ columnKey }: { columnKey: SortKey }) => {
    if (sortKey !== columnKey) return <ArrowUpDown className="h-3 w-3" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Servers"
          value={formatNumber(summary.total)}
          icon={Server}
        />
        <StatCard
          title="Active Servers"
          value={formatNumber(summary.active)}
          icon={Shield}
        />
        <StatCard
          title="Total Members"
          value={formatNumber(summary.totalMembers)}
          icon={Users}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="p-3 text-left font-medium">
                    <button
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      Server
                      <SortIcon columnKey="name" />
                    </button>
                  </th>
                  <th className="p-3 text-right font-medium">
                    <button
                      onClick={() => handleSort("memberCount")}
                      className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                    >
                      Members
                      <SortIcon columnKey="memberCount" />
                    </button>
                  </th>
                  <th className="p-3 text-center font-medium">Status</th>
                  <th className="p-3 text-right font-medium">
                    <button
                      onClick={() => handleSort("joinedAt")}
                      className="flex items-center gap-1 ml-auto hover:text-foreground transition-colors"
                    >
                      Joined
                      <SortIcon columnKey="joinedAt" />
                    </button>
                  </th>
                  <th className="p-3 text-right font-medium">Left</th>
                </tr>
              </thead>
              <tbody>
                {sortedGuilds.map((guild, index) => (
                  <tr
                    key={guild.id}
                    className={cn(
                      "border-b transition-colors hover:bg-muted/50",
                      index % 2 === 0 && "bg-muted/20"
                    )}
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <GuildIcon guild={guild} />
                        <span className="font-medium">{guild.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      {guild.memberCount.toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          guild.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        )}
                      >
                        {guild.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right text-muted-foreground" title={format(new Date(guild.joinedAt), "PPpp")}>
                      {formatDistanceToNow(new Date(guild.joinedAt), { addSuffix: true })}
                    </td>
                    <td className="p-3 text-right text-muted-foreground">
                      {guild.leftAt ? (
                        <span title={format(new Date(guild.leftAt), "PPpp")}>
                          {formatDistanceToNow(new Date(guild.leftAt), { addSuffix: true })}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
