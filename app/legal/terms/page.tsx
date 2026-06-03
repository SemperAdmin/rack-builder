import { promises as fs } from "fs";
import Link from "next/link";
import path from "path";

export const metadata = {
  title: "Terms of Service",
  description: "Terms of Service for Rack Builder. Understand the conditions of use and limitations."
};

async function getTermsOfService() {
  try {
    const filePath = path.join(process.cwd(), "public", "legal", "TERMS_OF_SERVICE.md");
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return "Terms of Service file not found.";
  }
}

export default async function TermsPage() {
  const termsContent = await getTermsOfService();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-wide">Terms of Service</h1>
        <Link
          href="/legal"
          className="text-sm text-usmc-scarlet hover:text-usmc-scarlet-300 underline"
        >
          Back to Legal Hub
        </Link>
      </div>

      <div className="card-surface bg-card border border-border rounded-card p-8 shadow-card prose-invert max-w-none">
        <div className="space-y-4 text-foreground">
          {termsContent.split("\n\n").map((section, idx) => (
            <div key={idx} className="whitespace-pre-wrap text-sm leading-relaxed">
              {section.split("\n").map((line, lineIdx) => {
                // Headers
                if (line.startsWith("# "))
                  return (
                    <h1 key={lineIdx} className="font-display text-3xl tracking-wide mt-6 mb-3">
                      {line.slice(2)}
                    </h1>
                  );
                if (line.startsWith("## "))
                  return (
                    <h2 key={lineIdx} className="font-display text-2xl tracking-wide mt-5 mb-2">
                      {line.slice(3)}
                    </h2>
                  );
                if (line.startsWith("### "))
                  return (
                    <h3 key={lineIdx} className="font-semibold text-lg mt-4 mb-2">
                      {line.slice(4)}
                    </h3>
                  );

                // Lists
                if (line.startsWith("- "))
                  return (
                    <li key={lineIdx} className="ml-6 text-sm text-foreground list-disc">
                      {line.slice(2)}
                    </li>
                  );

                // Numbered lists
                if (/^\d+\./.test(line))
                  return (
                    <li key={lineIdx} className="ml-6 text-sm text-foreground list-decimal">
                      {line.replace(/^\d+\.\s/, "")}
                    </li>
                  );

                // Horizontal rule
                if (line === "---")
                  return <hr key={lineIdx} className="border-border my-6" />;

                // Code blocks (tables, code)
                if (line.startsWith("```") || line.startsWith("|"))
                  return null;

                // Regular paragraph
                if (line.trim())
                  return (
                    <p key={lineIdx} className="text-sm text-foreground mb-3">
                      {line}
                    </p>
                  );

                return <br key={lineIdx} />;
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Consent Acknowledgment */}
      <div className="card-surface bg-surface-2 border border-border rounded-card p-6 shadow-card">
        <p className="text-sm text-foreground mb-3">
          <strong className="font-semibold">By using Rack Builder, you acknowledge:</strong>
        </p>
        <ul className="space-y-2 text-sm text-foreground">
          <li className="flex items-start gap-3">
            <span className="text-usmc-scarlet font-bold flex-shrink-0">✓</span>
            <span>You have read and agree to the Terms of Service and Privacy Policy.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-usmc-scarlet font-bold flex-shrink-0">✓</span>
            <span>You understand this tool is provided AS-IS without warranty.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-usmc-scarlet font-bold flex-shrink-0">✓</span>
            <span>You accept all responsibility for your use and reliance on the App.</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-usmc-scarlet font-bold flex-shrink-0">✓</span>
            <span>You will independently verify all information with official USMC regulations.</span>
          </li>
        </ul>
      </div>

      <div className="flex gap-4 justify-center pt-6">
        <Link
          href="/legal"
          className="px-6 py-2 rounded-button bg-surface-3 hover:bg-surface-4 text-foreground text-sm font-semibold transition-colors"
        >
          Back to Legal Hub
        </Link>
        <Link
          href="/legal/privacy"
          className="px-6 py-2 rounded-button bg-usmc-scarlet hover:bg-usmc-scarlet-700 text-white text-sm font-semibold transition-colors"
        >
          View Privacy Policy
        </Link>
      </div>
    </div>
  );
}
