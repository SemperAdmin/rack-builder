import { notFound } from "next/navigation";
import { allAwards, getAwardById } from "@/lib/awards";
import { DEVICE_SPECS } from "@/lib/devices";
import type { DeviceCode } from "@/lib/types";
import { BackToBuilder } from "@/components/BackToBuilder";

// Static generation for every award in the dataset, including non-Marine
// entries, per session decision.
export function generateStaticParams() {
  return allAwards.map((a) => ({ id: a.id }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AwardDetailPage({ params }: PageProps) {
  const { id } = await params;
  const award = getAwardById(id);
  if (!award) notFound();

  const deviceCitationKeys: Record<DeviceCode, string | undefined> = {
    star_gold_5_16: award.citations.devices,
    star_silver_5_16: award.citations.devices,
    star_bronze_3_16: award.citations.devices,
    star_silver_3_16: award.citations.devices,
    oak_leaf_bronze: award.citations.devices,
    oak_leaf_silver: award.citations.devices,
    v_device: award.citations.vDevice,
    c_device: award.citations.cDevice,
    r_device: award.citations.rDevice,
    m_device: undefined,
    numeral_gold: award.citations.numerals,
    numeral_bronze: award.citations.numerals,
    fmf_device: undefined,
    wreath_bronze: undefined,
    palm_bronze: undefined,
    frame_bronze: undefined
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <BackToBuilder />

      <header className="card-surface bg-card border border-border rounded-card p-6 shadow-card ambient-bloom">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-xs uppercase tracking-widest text-brass">
                Precedence {award.precedence} - {award.category.toUpperCase()}
              </span>
              {!award.marineApplicable && (
                <span className="font-mono text-[10px] uppercase text-status-stale border border-status-stale rounded-xs px-2 py-0.5">
                  Not Marine-applicable
                </span>
              )}
            </div>
            <h1 className="font-display text-5xl tracking-wide">
              <span className="gradient-accent">{award.shortName}</span>
            </h1>
            <p className="text-xl text-foreground mt-1">{award.name}</p>
          </div>
          {award.image.fileExists && award.image.ribbon && (
            <div className="flex-shrink-0">
              <img
                src={award.image.ribbon}
                alt={`${award.name} ribbon`}
                className="border border-border rounded-xs"
                style={{ width: "180px", height: "auto" }}
              />
            </div>
          )}
        </div>
      </header>

      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">AUTHORITY</h2>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {award.issuingAuthority && (
            <DefRow label="Issuing authority">{award.issuingAuthority}</DefRow>
          )}
          {award.statutoryReference && (
            <DefRow label="Statutory reference">
              <span className="font-mono">{award.statutoryReference}</span>
            </DefRow>
          )}
          {award.effectiveDate && (
            <DefRow label="Effective date">{award.effectiveDate}</DefRow>
          )}
          <DefRow label="Category">{award.category.toUpperCase()}</DefRow>
        </dl>
      </section>

      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">CRITERIA</h2>
        <p className="text-base leading-relaxed mb-4">{award.criteriaSummary}</p>
        {award.criteriaFullText && (
          <details className="mt-4 border border-border rounded-button p-4 bg-surface-2">
            <summary className="cursor-pointer font-mono text-xs uppercase tracking-widest text-brass">
              Full text
            </summary>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{award.criteriaFullText}</p>
          </details>
        )}
        {award.evidenceStandard && (
          <div className="mt-4 border-l-4 border-usmc-scarlet pl-4 py-2 bg-surface-2 rounded-r-button">
            <h3 className="font-mono text-xs uppercase tracking-widest text-usmc-scarlet-300 mb-1">
              Evidence standard
            </h3>
            <p className="text-sm">{award.evidenceStandard}</p>
          </div>
        )}
      </section>

      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">DEVICES</h2>
        {award.devices.authorized.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">No devices authorized for this award.</p>
        ) : (
          <>
            {award.devices.subsequentAwardMarker && (
              <div className="mb-4 text-sm text-muted-foreground italic">
                <span className="font-mono uppercase tracking-widest text-xs text-brass mr-2">
                  Subsequent award marker:
                </span>
                {award.devices.subsequentAwardMarker}
              </div>
            )}
            <ul className="space-y-3">
              {award.devices.authorized.map((code) => {
                const spec = DEVICE_SPECS[code as DeviceCode];
                if (!spec) return null;
                const cite = deviceCitationKeys[code as DeviceCode] ?? "";
                return (
                  <li key={code} className="flex items-start gap-3 border border-border rounded-button p-3 bg-surface-2">
                    <span
                      className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-xs"
                      style={{ background: "var(--color-surface-3)", color: spec.color, fontWeight: 700 }}
                    >
                      {spec.short}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">{spec.label}</div>
                      <div className="font-mono text-[11px] text-subtle-foreground mt-1">{spec.citation}</div>
                      {cite && (
                        <div className="font-mono text-[11px] text-subtle-foreground">Award reference: {cite}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <DeviceContextNotes devices={award.devices} />
          </>
        )}
      </section>

      {award.wearNotes && (
        <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
          <h2 className="font-display text-2xl tracking-wide mb-4">WEAR NOTES</h2>
          <p className="text-sm leading-relaxed">{award.wearNotes}</p>
        </section>
      )}

      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">CITATIONS</h2>
        <ul className="space-y-2 text-sm">
          {Object.entries(award.citations).map(([key, value]) => {
            if (!value) return null;
            return (
              <li key={key} className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-brass md:w-32 flex-shrink-0">
                  {key}
                </span>
                <span className="font-mono text-xs text-subtle-foreground">{value}</span>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 font-mono text-[10px] text-subtle-foreground uppercase tracking-wide">
          Citations are reference text only. Consult MCO 1020.34H, SECNAVINST 1650.1J, and SECNAV M-1650.1 directly for authoritative source.
        </p>
      </section>
    </div>
  );
}

function DefRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-xs uppercase tracking-widest text-brass mb-1">{label}</dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

function DeviceContextNotes({ devices }: { devices: import("@/lib/types").AwardDevices }) {
  const notes: Array<{ label: string; text: string }> = [];
  if (devices.valorContext) notes.push({ label: "Valor (V) context", text: devices.valorContext });
  if (devices.cDeviceContext) notes.push({ label: "Combat (C) context", text: devices.cDeviceContext });
  if (devices.rDeviceContext) notes.push({ label: "Remote (R) context", text: devices.rDeviceContext });
  if (devices.cDeviceNotAuthorized) notes.push({ label: "C device excluded", text: devices.cDeviceNotAuthorized });
  if (devices.complexRule) notes.push({ label: "Complex rule", text: devices.complexRule });

  if (notes.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h3 className="font-mono text-xs uppercase tracking-widest text-brass">Device context</h3>
      <ul className="space-y-2 text-sm">
        {notes.map((n, i) => (
          <li key={i} className="border-l-4 border-status-info pl-3 py-1">
            <span className="font-semibold text-status-info">{n.label}: </span>
            <span>{n.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
