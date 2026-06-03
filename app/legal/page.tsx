import Link from "next/link";

export const metadata = {
  title: "Legal Hub",
  description: "Privacy Policy, Terms of Service, and legal information for Rack Builder."
};

export default function LegalHub() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header className="card-surface bg-card border border-border rounded-card p-6 shadow-card ambient-bloom">
        <h1 className="font-display text-4xl tracking-wide mb-2">
          <span className="gradient-accent">LEGAL</span> HUB
        </h1>
        <p className="text-foreground">
          Privacy, terms of service, and compliance information for Rack Builder.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Privacy Policy */}
        <Link
          href="/legal/privacy"
          className="card-surface bg-card border border-border rounded-card p-6 shadow-card hover:shadow-lg hover:border-usmc-scarlet-300 transition-all"
        >
          <div className="space-y-3">
            <h2 className="font-display text-2xl tracking-wide text-usmc-scarlet">PRIVACY POLICY</h2>
            <p className="text-sm text-foreground">
              Learn how we collect, use, and protect your data. Find out what information is stored and how you can manage
              your privacy.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-surface-2 rounded-button text-subtle-foreground">
                Read full policy →
              </span>
            </div>
          </div>
        </Link>

        {/* Terms of Service */}
        <Link
          href="/legal/terms"
          className="card-surface bg-card border border-border rounded-card p-6 shadow-card hover:shadow-lg hover:border-usmc-scarlet-300 transition-all"
        >
          <div className="space-y-3">
            <h2 className="font-display text-2xl tracking-wide text-usmc-scarlet">TERMS OF SERVICE</h2>
            <p className="text-sm text-foreground">
              Understand the conditions of use, limitations of liability, disclaimers, and your responsibilities when
              using Rack Builder.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 text-xs font-semibold bg-surface-2 rounded-button text-subtle-foreground">
                Read full terms →
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Key Points Section */}
      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">KEY POINTS AT A GLANCE</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-surface-2 rounded-button p-4">
            <h3 className="font-semibold text-usmc-scarlet mb-2">Privacy</h3>
            <p className="text-subtle-foreground text-xs">
              We collect zero personal data. Your rack configuration is stored only in your browser URL, never on our servers.
            </p>
          </div>
          <div className="bg-surface-2 rounded-button p-4">
            <h3 className="font-semibold text-usmc-scarlet mb-2">As-Is Disclaimer</h3>
            <p className="text-subtle-foreground text-xs">
              Rack Builder is a reference tool only. It is not a substitute for official USMC regulations. Always verify
              with your chain of command.
            </p>
          </div>
          <div className="bg-surface-2 rounded-button p-4">
            <h3 className="font-semibold text-usmc-scarlet mb-2">No Liability</h3>
            <p className="text-subtle-foreground text-xs">
              We are not liable for errors, inaccuracies, or consequences of using the App. You assume all risk of reliance.
            </p>
          </div>
        </div>
      </section>

      {/* Regulatory Basis Section */}
      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">REGULATORY AUTHORITY</h2>
        <p className="text-sm text-foreground mb-4">
          Rack Builder provides reference information based on the following authoritative USMC sources:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-3">
            <span className="font-mono text-xs text-usmc-scarlet font-semibold flex-shrink-0">MCO 1020.34H</span>
            <span className="text-foreground">Uniforms and Appearance of the Marine Corps Uniform</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-mono text-xs text-usmc-scarlet font-semibold flex-shrink-0">SECNAVINST 1650.1J</span>
            <span className="text-foreground">Military Decorations and Medals</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="font-mono text-xs text-usmc-scarlet font-semibold flex-shrink-0">SECNAV M-1650.1</span>
            <span className="text-foreground">The Navy and Marine Corps Awards Manual</span>
          </li>
        </ul>
        <p className="text-xs text-subtle-foreground mt-4 italic">
          Consult official regulatory documents directly for authoritative guidance. This tool is for reference and planning
          purposes only.
        </p>
      </section>

      {/* Questions */}
      <section className="card-surface bg-card border border-border rounded-card p-6 shadow-card">
        <h2 className="font-display text-2xl tracking-wide mb-4">QUESTIONS?</h2>
        <p className="text-sm text-foreground mb-4">
          If you have questions or concerns about our Privacy Policy, Terms of Service, or legal compliance, please contact us:
        </p>
        <div className="bg-surface-2 rounded-button p-4 text-sm font-mono">
          <p className="text-foreground text-subtle-foreground">
            Contact information available upon request through GitHub issues or official USMC channels.
          </p>
        </div>
        <p className="text-xs text-subtle-foreground mt-4">We will respond to all inquiries within 30 days.</p>
      </section>

      {/* Back to Builder */}
      <div className="flex justify-center pt-4">
        <Link
          href="/"
          className="px-6 py-2 rounded-button bg-usmc-scarlet hover:bg-usmc-scarlet-700 text-white text-sm font-semibold transition-colors"
        >
          Back to Builder
        </Link>
      </div>
    </div>
  );
}
