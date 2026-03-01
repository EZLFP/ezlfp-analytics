"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Affiliate } from "@/types/analytics";
import { cn } from "@/lib/utils";
import { updateAffiliate } from "@/lib/analytics";
import { format, formatDistanceToNow } from "date-fns";

interface AffiliatesTableProps {
  affiliates: Affiliate[];
}

export function AffiliatesTable({ affiliates }: AffiliatesTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleActive = async (affiliate: Affiliate) => {
    setLoadingId(affiliate.id);
    try {
      await updateAffiliate(affiliate.id, { isActive: !affiliate.isActive });
      router.refresh();
    } catch (error) {
      console.error("Failed to toggle affiliate:", error);
    } finally {
      setLoadingId(null);
    }
  };

  if (affiliates.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-4 text-center">
        No affiliates yet. Create one above.
      </p>
    );
  }

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
            <tr
              key={affiliate.id}
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
              <td className="p-3 text-right font-medium">
                {affiliate.totalSignups}
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
