"use client";

import { Fragment, useState } from "react";
import type { Affiliate, AffiliateUser } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { updateAffiliate, getAffiliateUsers } from "@/lib/analytics";
import { revalidateAffiliates } from "@/app/affiliates/actions";
import { format, formatDistanceToNow } from "date-fns";

interface AffiliatesTableProps {
  affiliates: Affiliate[];
}

function formatRank(tier: string, division: number): string {
  const t = tier.charAt(0) + tier.slice(1).toLowerCase();
  return `${t} ${division}`;
}

function UserList({ users }: { users: AffiliateUser[] }) {
  return (
    <div className="rounded-md border bg-background">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-2 text-left font-medium">Discord</th>
            <th className="p-2 text-left font-medium">Riot ID</th>
            <th className="p-2 text-left font-medium">LoL Rank</th>
            <th className="p-2 text-left font-medium">Val Rank</th>
            <th className="p-2 text-right font-medium">Referred</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-b-0 hover:bg-muted/50">
              <td className="p-2 font-medium">
                {user.discordDisplayName || user.discordUsername}
              </td>
              <td className="p-2 text-muted-foreground">{user.riotId}</td>
              <td className="p-2 text-muted-foreground">
                {formatRank(user.lolTier, user.lolDivision)}
              </td>
              <td className="p-2 text-muted-foreground">
                {user.valorantTier
                  ? user.valorantTier.charAt(0) + user.valorantTier.slice(1).toLowerCase()
                  : "—"}
              </td>
              <td className="p-2 text-right text-muted-foreground">
                {user.referredAt
                  ? formatDistanceToNow(new Date(user.referredAt), { addSuffix: true })
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AffiliatesTable({ affiliates }: AffiliatesTableProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedCode, setExpandedCode] = useState<string | null>(null);
  const [usersMap, setUsersMap] = useState<Record<string, AffiliateUser[]>>({});
  const [loadingUsers, setLoadingUsers] = useState<string | null>(null);

  const handleToggleActive = async (affiliate: Affiliate) => {
    setLoadingId(affiliate.id);
    try {
      await updateAffiliate(affiliate.id, { isActive: !affiliate.isActive });
      await revalidateAffiliates();
    } catch (error) {
      console.error("Failed to toggle affiliate:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleUsers = async (code: string) => {
    if (expandedCode === code) {
      setExpandedCode(null);
      return;
    }

    setExpandedCode(code);

    if (!usersMap[code]) {
      setLoadingUsers(code);
      try {
        const data = await getAffiliateUsers(code);
        setUsersMap((prev) => ({ ...prev, [code]: data.users }));
      } catch (error) {
        console.error("Failed to fetch affiliate users:", error);
      } finally {
        setLoadingUsers(null);
      }
    }
  };

  if (affiliates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No affiliates yet. Create one above.
      </p>
    );
  }

  const colCount = 8;

  return (
    <div className="rounded-md border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-3 text-left font-medium">Code</th>
            <th className="p-3 text-left font-medium">Name</th>
            <th className="p-3 text-left font-medium">Platform</th>
            <th className="p-3 text-center font-medium">Status</th>
            <th className="p-3 text-right font-medium">Total Signups</th>
            <th className="p-3 text-right font-medium">Last 30 Days</th>
            <th className="p-3 text-right font-medium">Created</th>
            <th className="p-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {affiliates.map((affiliate, index) => (
            <Fragment key={affiliate.id}>
              <tr
                className={cn(
                  "border-b transition-colors hover:bg-muted/50",
                  index % 2 === 0 && "bg-muted/20"
                )}
              >
                <td className="p-3">
                  <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                    {affiliate.code}
                  </code>
                </td>
                <td className="p-3 font-medium">{affiliate.name}</td>
                <td className="p-3 text-muted-foreground">
                  {affiliate.platform || "—"}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      affiliate.isActive
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    )}
                  >
                    {affiliate.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  {affiliate.totalSignups > 0 ? (
                    <button
                      onClick={() => handleToggleUsers(affiliate.code)}
                      className={cn(
                        "font-medium underline decoration-dotted underline-offset-4 hover:decoration-solid transition-colors",
                        expandedCode === affiliate.code
                          ? "text-blue-600 dark:text-blue-400"
                          : "hover:text-blue-600 dark:hover:text-blue-400"
                      )}
                    >
                      {affiliate.totalSignups}
                    </button>
                  ) : (
                    <span className="font-medium">0</span>
                  )}
                </td>
                <td className="p-3 text-right">{affiliate.last30DaysSignups}</td>
                <td
                  className="p-3 text-right text-muted-foreground"
                  title={format(new Date(affiliate.createdAt), "PPpp")}
                >
                  {formatDistanceToNow(new Date(affiliate.createdAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleToggleActive(affiliate)}
                    disabled={loadingId === affiliate.id}
                    className={cn(
                      "rounded px-3 py-1 text-xs font-medium transition-colors",
                      affiliate.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                        : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50",
                      loadingId === affiliate.id && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {loadingId === affiliate.id
                      ? "..."
                      : affiliate.isActive
                        ? "Deactivate"
                        : "Activate"}
                  </button>
                </td>
              </tr>
              {expandedCode === affiliate.code && (
                <tr className="border-b">
                  <td colSpan={colCount} className="p-4 bg-muted/10">
                    {loadingUsers === affiliate.code ? (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Loading users...
                      </p>
                    ) : usersMap[affiliate.code]?.length ? (
                      <UserList users={usersMap[affiliate.code]} />
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        No users found
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
