import { promises as fs } from "fs";
import Link from "next/link";
import path from "path";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy for Rack Builder. Learn how we handle your data."
};

async function getPrivacyPolicy() {
  try {
    const filePath = path.join(process.cwd(), "public", "legal", "PRIVACY_POLICY.md");
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    return "Privacy policy file not found.";
  }
}

function markdownToHtml(markdown: string) {
  return markdown
    .split("\n")
    .map((line) => {
      // Headers
      if (line.startsWith("# "))
        return `<h1 class="font-display text-3xl tracking-wide mt-6 mb-3">${line.slice(2)}</h1>`;
      if (line.startsWith("## "))
        return `<h2 class="font-display text-2xl tracking-wide mt-5 mb-2">${line.slice(3)}</h2>`;
      if (line.startsWith("### "))
        return `<h3 class="font-semibold text-lg mt-4 mb-2">${line.slice(4)}</h3>`;

      // Bold
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');

      // Code blocks (inline)
      line = line.replace(/`([^`]+)`/g, '<code class="bg-surface-2 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

      // Links
      line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-usmc-scarlet hover:text-usmc-scarlet-300 underline">$1</a>');

      // Horizontal rule
      if (line === "---")
        return '<hr class="border-border my-6">';

      // Lists
      if (line.startsWith("- "))
        return `<li class="ml-4 text-sm text-foreground">${line.slice(2)}</li>`;

      // Paragraphs
      if (line.trim())
        return `<p class="text-sm text-foreground mb-3">${line}</p>`;

      return "";
    })
    .join("\n")
    .replace(/<li/g, '<ul class="list-disc mb-3"><li')
    .replace(/<\/li>\n/g, '</li>\n')
    .replace(/(<li.*<\/li>)/s, (match) => `<ul class="list-disc mb-3">${match}</ul>`);
}

export default async function PrivacyPage() {
  const policyContent = await getPrivacyPolicy();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl tracking-wide">Privacy Policy</h1>
        <Link
          href="/legal"
          className="text-sm text-usmc-scarlet hover:text-usmc-scarlet-300 underline"
        >
          Back to Legal Hub
        </Link>
      </div>

      <div className="card-surface bg-card border border-border rounded-card p-8 shadow-card prose-invert max-w-none">
        <div className="space-y-4 text-foreground">
          {policyContent.split("\n\n").map((section, idx) => (
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

                // Horizontal rule
                if (line === "---")
                  return <hr key={lineIdx} className="border-border my-6" />;

                // Code blocks
                if (line.startsWith("```"))
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

      <div className="flex gap-4 justify-center pt-6">
        <Link
          href="/legal"
          className="px-6 py-2 rounded-button bg-surface-3 hover:bg-surface-4 text-foreground text-sm font-semibold transition-colors"
        >
          Back to Legal Hub
        </Link>
        <Link
          href="/legal/terms"
          className="px-6 py-2 rounded-button bg-usmc-scarlet hover:bg-usmc-scarlet-700 text-white text-sm font-semibold transition-colors"
        >
          View Terms of Service
        </Link>
      </div>
    </div>
  );
}
