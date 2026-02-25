import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  FunnelFieldInteraction,
  FunnelValidationFailure,
} from "@/types/analytics";

const STEP_NAMES: Record<number, string> = {
  1: "Discord Auth",
  2: "Riot Account",
  3: "Playstyle",
  4: "Communication",
  5: "Goals",
};

function formatFieldName(name: string): string {
  return name
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface FunnelFieldTablesProps {
  fieldInteractions: FunnelFieldInteraction[];
  validationFailures: FunnelValidationFailure[];
}

export function FunnelFieldTables({
  fieldInteractions,
  validationFailures,
}: FunnelFieldTablesProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Field Interactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Interactions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Which questions users interact with
          </p>
        </CardHeader>
        <CardContent>
          {fieldInteractions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Step</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Field</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {fieldInteractions.slice(0, 20).map((fi, i) => (
                    <tr
                      key={`${fi.step_number}-${fi.field_name}`}
                      className={i % 2 === 0 ? "bg-muted/20" : ""}
                    >
                      <td className="p-2 text-xs text-muted-foreground">
                        {STEP_NAMES[fi.step_number] || `Step ${fi.step_number}`}
                      </td>
                      <td className="p-2">{formatFieldName(fi.field_name)}</td>
                      <td className="p-2 text-right font-medium">
                        {fi.unique_sessions}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Validation Failures */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Validation Failures</CardTitle>
          <p className="text-sm text-muted-foreground">
            What&apos;s blocking users from advancing
          </p>
        </CardHeader>
        <CardContent>
          {validationFailures.length === 0 ? (
            <p className="text-sm text-muted-foreground">No failures recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium text-muted-foreground">Step</th>
                    <th className="text-left p-2 font-medium text-muted-foreground">Field</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Failures</th>
                    <th className="text-right p-2 font-medium text-muted-foreground">Users</th>
                  </tr>
                </thead>
                <tbody>
                  {validationFailures.slice(0, 20).map((vf, i) => (
                    <tr
                      key={`${vf.step_number}-${vf.field_name}`}
                      className={i % 2 === 0 ? "bg-muted/20" : ""}
                    >
                      <td className="p-2 text-xs text-muted-foreground">
                        {STEP_NAMES[vf.step_number] || `Step ${vf.step_number}`}
                      </td>
                      <td className="p-2">{formatFieldName(vf.field_name)}</td>
                      <td className="p-2 text-right font-medium text-red-500">
                        {vf.failure_count}
                      </td>
                      <td className="p-2 text-right">{vf.unique_sessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
