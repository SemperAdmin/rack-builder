"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Reads the current URL hash on mount so the back link round-trips the
// builder rack state. Server-side renders a stateless link; client effect
// upgrades the href once window is available.
export function BackToBuilder() {
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    if (typeof window !== "undefined") setHash(window.location.hash);
  }, []);

  return (
    <Link
      href={`/${hash}`}
      className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-brass hover:text-usmc-scarlet-300 transition-colors"
    >
      <span aria-hidden>&larr;</span>
      Back to builder
    </Link>
  );
}
