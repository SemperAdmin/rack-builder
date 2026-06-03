# Privacy Policy

**Effective Date**: June 2, 2026  
**Last Updated**: June 2, 2026

## 1. Introduction

Rack Builder ("App", "we", "us", "our") is a web-based USMC awards and ribbon rack management tool. This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.

**Bottom line**: We do not collect, store, or process any personally identifiable information (PII) about you. Your rack configuration is stored only in your browser's URL and memory—never on our servers.

---

## 2. Information We Collect

### 2.1 Information You Do NOT Provide
We do not ask for or collect:
- Your name, rank, email address, or other personal identifiers.
- Your military affiliation or service branch.
- Device identifiers or IP addresses.
- Location data or browsing history.
- Any form of account credentials or authentication tokens.

### 2.2 Information We Collect Automatically
We do not use cookies, analytics, or tracking pixels. We do not employ Firebase, Google Analytics, Mixpanel, or similar third-party tracking services.

The only information that leaves your device is:
- **HTTP requests to retrieve static assets**: ribbon images, stylesheet, and JavaScript bundles. These requests are logged by standard web server access logs (IP address, user-agent, timestamp) for infrastructure monitoring only. We do not analyze these logs to profile users.

### 2.3 Rack Configuration Storage
Your rack configuration (selected awards, devices, female uniform toggle) is encoded in your browser's URL hash (example: `#state=eyJmIjp0cnVlLCJlIjpb...`). This data:
- Remains entirely on your device.
- Is not transmitted to our servers except when loading the page.
- Is lost when you close the tab (unless you bookmark the URL).
- Is not stored in browser cookies, localStorage, or any cloud storage.

---

## 3. How We Use Information

We do not use personal data because we do not collect it. We do not:
- Track your behavior or sessions.
- Build profiles or audiences.
- Share data with advertisers, marketers, or partners.
- Sell or license any information about you.

---

## 4. Third-Party Services

### 4.1 Embedded Fonts
We use @fontsource-variable for embedded fonts (Inter, JetBrains Mono, Bebas Neue). These fonts are self-hosted and do not call external services or transmit data about you.

### 4.2 Content Delivery
The App is built with Next.js 15.5 and React 19. These frameworks do not embed tracking or analytics by default. We do not configure optional analytics plugins.

### 4.3 No Third-Party Data Processors
We do not use:
- Firebase, Supabase, or other cloud databases.
- Stripe, PayPal, or payment processors.
- Auth0, Okta, or authentication services.
- Twilio, SendGrid, or messaging services.
- Datadog, Sentry, or APM tools that transmit application data.

---

## 5. Data Retention and Deletion

Since we do not collect or store your data, there is nothing to delete. Your rack configuration is automatically discarded when:
- You close the browser tab.
- You clear your browser history or cache.
- You navigate to a new domain.

You can manually delete your configuration by clearing the URL hash.

---

## 6. Your Rights

### 6.1 Right to Access
You may view your rack configuration at any time by examining your browser's address bar. No request to us is required.

### 6.2 Right to Deletion
Your data is not stored on our servers. Your browser automatically deletes the configuration when your session ends. No action required.

### 6.3 Right to Portability
Your rack configuration is stored in a standard JSON format within the URL. You can copy the URL and share it with others, or extract the JSON manually.

### 6.4 Right to Object to Processing
We do not process your personal data. This right does not apply.

---

## 7. Data Security

Since we do not collect or store personal data on our servers, there is no data breach risk from our infrastructure. However:
- If you share your rack URL with others, anyone with that URL can view your configuration.
- Your browser URL history may contain your encoded rack configuration if you do not clear it manually.
- If your device is compromised, an attacker could potentially extract the URL hash from your browser history.

We recommend:
- **Do not share your rack URL** if you wish to keep your configuration private.
- **Clear your browser history** periodically to avoid accidental exposure of URLs.
- **Use HTTPS** (which we provide) to encrypt the transmission of static assets.

---

## 8. Children's Privacy

This App is designed for adult military personnel (officers and enlisted). We do not knowingly collect data from children under 13. If you believe a child's data has been collected, contact us immediately (see Section 12).

---

## 9. International Data Transfers

We do not transfer personal data internationally because we do not collect it. This policy applies uniformly to all users regardless of location.

---

## 10. GDPR and CCPA Compliance

### 10.1 GDPR (EU)
Under GDPR, Rack Builder is compliant because:
- We are not a data controller. We do not collect, process, or store personal data.
- Your rack configuration is self-hosted in your browser.
- There is no legal basis needed for processing because processing does not occur.

### 10.2 CCPA/CPRA (California)
Under CCPA/CPRA, Rack Builder is compliant because:
- We do not collect, retain, share, or sell personal information as defined by the statute.
- No "sale of personal information" occurs.
- No "right to delete" request is necessary because we hold no data to delete.

---

## 11. Policy Changes

We may update this Privacy Policy from time to time to reflect changes in law or practice. We will post updated versions on this page with a revised "Last Updated" date. Your continued use of the App after changes constitutes acceptance of the updated policy.

---

## 12. Contact Us

If you have questions or concerns about this Privacy Policy, or if you believe your privacy has been compromised, contact via GitHub issues or official USMC channels. All inquiries will be addressed in a timely manner.

---

## 13. Appendix: Technical Detail

### Data Flow Diagram

```
User Browser                              Rack Builder Server
    |                                             |
    ├─ Enter award/device data (memory)          |
    ├─ Encode to URL hash (client-side only)     |
    ├─ (Request HTML/CSS/JS assets) ─────────────> (Serve static files)
    │                                             |
    │ <──── Static assets (200 OK) ───────────────┤
    │                                             |
    ├─ Render UI (client-side)                   |
    └─ Configuration stays in URL #state=...     (No backend storage)
```

**Data on our servers**: Nil. Web server logs contain IP and user-agent only.  
**Data in your browser**: Your rack configuration (awards, devices, preferences).  
**Data in transit**: Only HTTP request/response headers (HTTPS encrypted).

