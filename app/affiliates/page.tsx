import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/navbar";
import { getAffiliates } from "@/lib/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AffiliatesTable } from "@/components/dashboard/affiliates-table";
import { CreateAffiliateForm } from "@/components/dashboard/create-affiliate-form";

export default async function AffiliatesPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await getAffiliates();

  const activeCount = data.affiliates.filter((a) => a.isActive).length;
  const totalSignups = data.affiliates.reduce(
    (sum, a) => sum + a.totalSignups,
    0
  );
  const last30DaysSignups = data.affiliates.reduce(
    (sum, a) => sum + a.last30DaysSignups,
    0
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Affiliates</h1>
          <p className="text-muted-foreground mt-1">
            Manage affiliate codes and track referral signups
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Affiliates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.affiliates.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {activeCount} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Referred Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSignups}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last 30 Days Signups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{last30DaysSignups}</div>
              <p className="text-xs text-muted-foreground">Recent referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Create Affiliate Form */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Create Affiliate</CardTitle>
              <p className="text-sm text-muted-foreground">
                Add a new affiliate code for a streamer
              </p>
            </CardHeader>
            <CardContent>
              <CreateAffiliateForm />
            </CardContent>
          </Card>
        </section>

        {/* Affiliates Table */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>All Affiliates</CardTitle>
              <p className="text-sm text-muted-foreground">
                {data.affiliates.length} affiliate
                {data.affiliates.length !== 1 ? "s" : ""} total
              </p>
            </CardHeader>
            <CardContent>
              <AffiliatesTable affiliates={data.affiliates} />
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
