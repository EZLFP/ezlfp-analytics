import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { getFunnelStats } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunnelOverviewCards } from "@/components/dashboard/funnel-overview-cards";
import { FunnelStepChart } from "@/components/dashboard/funnel-step-chart";
import { FunnelDropoffSection } from "@/components/dashboard/funnel-dropoff-section";
import { FunnelTimeChart } from "@/components/dashboard/funnel-time-chart";
import { FunnelDailyChart } from "@/components/dashboard/funnel-daily-chart";
import { FunnelFieldTables } from "@/components/dashboard/funnel-field-tables";
import { FunnelSessionsTable } from "@/components/dashboard/funnel-sessions-table";

export default async function FunnelPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await getFunnelStats(30);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Funnel Analytics</h1>
          <p className="text-muted-foreground mt-1">
            {data.period} — Compatibility report wizard conversion tracking
          </p>
        </div>

        {/* Overview Cards */}
        <FunnelOverviewCards data={data} />

        {/* Step-by-Step Funnel */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Funnel</CardTitle>
              <p className="text-sm text-muted-foreground">
                How many users reach each step of the form
              </p>
            </CardHeader>
            <CardContent>
              <FunnelStepChart steps={data.steps} />
            </CardContent>
          </Card>
        </section>

        {/* Drop-off Analysis */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Drop-off Analysis</h2>
          <FunnelDropoffSection steps={data.steps} />
        </section>

        {/* Time Per Step */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Average Time Per Step</CardTitle>
              <p className="text-sm text-muted-foreground">
                How long users spend on each step (seconds)
              </p>
            </CardHeader>
            <CardContent>
              <FunnelTimeChart steps={data.steps} />
            </CardContent>
          </Card>
        </section>

        {/* Daily Trend */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Daily Sessions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Sessions started vs completed over time
              </p>
            </CardHeader>
            <CardContent>
              <FunnelDailyChart data={data.daily_sessions} />
            </CardContent>
          </Card>
        </section>

        {/* Field Analytics */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Field-Level Analytics</h2>
          <FunnelFieldTables
            fieldInteractions={data.field_interactions}
            validationFailures={data.validation_failures}
          />
        </section>

        {/* Recent Sessions */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sessions</CardTitle>
              <p className="text-sm text-muted-foreground">
                Last 50 sessions — see how far each user got
              </p>
            </CardHeader>
            <CardContent>
              <FunnelSessionsTable sessions={data.recent_sessions} />
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          <p>
            EZLFP Analytics Dashboard • Data updates every 1-2 minutes • Built
            with Next.js
          </p>
        </div>
      </footer>
    </div>
  );
}
