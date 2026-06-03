// Consent state management for ToS/Privacy Policy acceptance.
// Stored in browser localStorage with consent version tracking.

const CONSENT_KEY = "rack-builder-consent";
const CONSENT_VERSION = "1.0.0";

export interface ConsentState {
  version: string;
  accepted: boolean;
  acceptedAt: number; // Unix timestamp (ms)
  acceptedToS: boolean;
  acceptedPrivacy: boolean;
}

export function getConsentState(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    const state = JSON.parse(stored) as Partial<ConsentState>;
    // Version mismatch = reset consent (user must re-accept on policy update)
    if (state.version !== CONSENT_VERSION) return null;
    return state as ConsentState;
  } catch {
    return null;
  }
}

export function hasAcceptedConsent(): boolean {
  const state = getConsentState();
  return state?.accepted === true && state?.acceptedToS === true;
}

export function setConsent(accepted: boolean): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = {
    version: CONSENT_VERSION,
    accepted,
    acceptedAt: Date.now(),
    acceptedToS: accepted,
    acceptedPrivacy: accepted
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
}

export function resetConsent(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CONSENT_KEY);
}
