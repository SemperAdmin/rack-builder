import { marineAwards } from "@/lib/awards";

interface RowDatum {
  precedence: number;
  shortName: string;
  name: string;
  category: string;
  hasImage: boolean;
  imagePath: string | null;
  authorizedDevices: number;
  hasCDeviceExclusion: boolean;
  hasVDeviceContext: boolean;
}

export default function AuditPage() {
  const rows: RowDatum[] = marineAwards.map((a) => ({
    precedence: a.precedence,
    shortName: a.shortName,
    name: a.name,
    category: a.category,
    hasImage: a.image.fileExists,
    imagePath: a.image.ribbon,
    authorizedDevices: a.devices.authorized.length,
    hasCDeviceExclusion: Boolean(a.devices.cDeviceNotAuthorized),
    hasVDeviceContext: Boolean(a.devices.valorContext)
  }));

  const total = rows.length;
  const withImage = rows.filter((r) => r.hasImage).length;
  const withoutImage = total - withImage;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h1 className="font-display text-4xl tracking-wide">
          <span className="gradient-accent">DATA</span> AUDIT
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Marine-applicable awards loaded from data/awards.json. Cross-check against ribbon image library.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Stat label="Marine awards" value={total} />
          <Stat label="With ribbon image" value={withImage} accent="fresh" />
          <Stat label="Missing ribbon image" value={withoutImage} accent="stale" />
        </div>
      </div>

      <div className="card-surface bg-card border border-border rounded-card overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-3 py-2">P</th>
              <th className="text-left px-3 py-2">Short</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Cat</th>
              <th className="text-center px-3 py-2">Image</th>
              <th className="text-center px-3 py-2">Devices</th>
              <th className="text-center px-3 py-2">Flags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.precedence} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{r.precedence}</td>
                <td className="px-3 py-2 font-mono">{r.shortName}</td>
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2 text-xs uppercase">{r.category}</td>
                <td className="px-3 py-2 text-center">
                  {r.hasImage ? (
                    <span className="text-status-fresh font-mono text-xs">OK</span>
                  ) : (
                    <span className="text-status-stale font-mono text-xs">MISSING</span>
                  )}
                </td>
                <td className="px-3 py-2 text-center font-mono text-xs">{r.authorizedDevices}</td>
                <td className="px-3 py-2 text-center text-xs">
                  {r.hasCDeviceExclusion && <span className="mr-1 text-status-aging">!C</span>}
                  {r.hasVDeviceContext && <span className="text-status-info">V</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: "fresh" | "stale" }) {
  const color =
    accent === "fresh" ? "text-status-fresh" : accent === "stale" ? "text-status-stale" : "text-foreground";
  return (
    <div className="bg-surface-2 rounded-md p-4 border border-border">
      <div className="text-xs uppercase tracking-wider text-subtle-foreground">{label}</div>
      <div className={`font-display text-4xl ${color}`}>{value}</div>
    </div>
  );
}
