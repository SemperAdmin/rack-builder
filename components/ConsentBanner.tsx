"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { hasAcceptedConsent, setConsent } from "@/lib/consent";

export function ConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  useEffect(() => {
    // Only show banner if user has not accepted consent
    if (!hasAcceptedConsent()) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    setShowBanner(false);
  };

  const handleReject = () => {
    // User can still use the app after reject, but we track that they declined
    setConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4">
      <div className="max-w-2xl mx-auto card-surface bg-card border border-border rounded-card p-6 shadow-lg">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-display text-lg tracking-wide mb-2">Legal Agreement</h2>
            <p className="text-sm text-foreground mb-3">
              Before using Rack Builder, please review and accept our{" "}
              <Link href="/legal/terms" className="text-usmc-scarlet hover:text-usmc-scarlet-300 underline">
                Terms of Service
              </Link>
              {" "}and{" "}
              <Link href="/legal/privacy" className="text-usmc-scarlet hover:text-usmc-scarlet-300 underline">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="text-xs text-subtle-foreground italic">
              This tool provides USMC regulatory references only. It is not a substitute for official MCO 1020.34H,
              SECNAVINST 1650.1J, or SECNAV M-1650.1 guidance. Consult your chain of command for official approval.
            </p>
          </div>

          <div className="flex items-start gap-3 bg-surface-2 rounded-button p-3">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-1 flex-shrink-0 cursor-pointer"
            />
            <label htmlFor="consent-checkbox" className="text-xs text-foreground cursor-pointer">
              <span className="font-semibold">I agree to the Terms of Service and Privacy Policy.</span>
              <br />
              <span className="text-subtle-foreground">
                This tool is provided AS-IS without warranty. I understand it is a reference tool only and that I must
                independently verify compliance with official USMC regulations.
              </span>
            </label>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleReject}
              className="px-4 py-2 rounded-button bg-surface-3 hover:bg-surface-4 text-sm text-foreground transition-colors"
            >
              Continue Without Accepting
            </button>
            <button
              type="button"
              onClick={handleAccept}
              disabled={!consentChecked}
              className="px-4 py-2 rounded-button bg-usmc-scarlet text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-usmc-scarlet-700 transition-colors"
              title="Check the box above to enable this button"
            >
              I Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
