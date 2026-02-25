import { StatCard } from "@/components/stat-card";
import { Users, CheckCircle, TrendingUp, LogOut } from "lucide-react";
import type { FunnelStatsResponse } from "@/types/analytics";

interface FunnelOverviewCardsProps {
  data: FunnelStatsResponse;
}

export function FunnelOverviewCards({ data }: FunnelOverviewCardsProps) {
  const { overview } = data;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Sessions"
        value={overview.total_sessions}
        subtitle="Users who opened the form"
        icon={Users}
      />
      <StatCard
        title="Completed"
        value={overview.completed_sessions}
        subtitle="Successfully submitted"
        icon={CheckCircle}
      />
      <StatCard
        title="Conversion Rate"
        value={`${overview.conversion_rate}%`}
        subtitle="Sessions → Submissions"
        icon={TrendingUp}
      />
      <StatCard
        title="Abandoned"
        value={overview.abandoned_sessions}
        subtitle="Left without submitting"
        icon={LogOut}
      />
    </div>
  );
}
