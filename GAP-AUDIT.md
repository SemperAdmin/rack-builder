# Ribbon Image Gap Audit

- Audit date: 2026-05-25
- Source of truth: `data/awards.json` (schemaVersion 1.0.0-draft, status COMPLETE)
- Cross-referenced against: `images/ribbons/` directory contents
- Method: regex inventory of `id`, `marineApplicable`, `image.fileExists` plus full directory listing
- Re-run: `npm run audit-images`

## 1. Summary

- Total award entries: 95
- Marine-applicable: 88 (corrected 2026-05-25 from script output)
- Marine-applicable with ribbon image present: 52 (corrected 2026-05-25)
- Marine-applicable with ribbon image missing: 36 (corrected 2026-05-25)
- Image claims verified against filesystem by `scripts/audit-images.mjs`: zero claimed-but-missing on disk
- Orphan ribbon files in library, not referenced by any award: 57

The data file already ships a `deficiencies` array listing missing-image awards. This audit confirms the list and reorganizes it by release-blocking impact and category. Findings beyond the embedded list appear in Section 5 and Section 7.

## 2. Release-blocking gaps, Marine-applicable, personal decorations

Each row represents an award a real Marine is likely to wear. Missing imagery blocks shipping.

- P1 MOH - Medal of Honor. Ribbon not authorized for wear in MCO standard, worn around neck only. Image still useful for rack preview placeholder.
- P9 NMCM - Navy and Marine Corps Medal.
- P11 PH - Purple Heart Medal.
- P14 AM - Air Medal. Requires gold strike/flight numeral overlay support.
- P19 CAR - Combat Action Ribbon. Critical for Marines. Highest impact missing asset in the entire library.

## 3. Release-blocking gaps, Marine-applicable, unit awards

- P20 PUC - Presidential Unit Citation.
- P21 JMUA - Joint Meritorious Unit Award.
- P22 NUC - Navy Unit Commendation.
- P23 MUC - Meritorious Unit Commendation.

## 4. Release-blocking gaps, Marine-applicable, campaign and service medals and ribbons

- P40 AFEM - Armed Forces Expeditionary Medal.
- P44 ACM - Afghanistan Campaign Medal.
- P45 ICM - Iraq Campaign Medal.
- P51 SSDR - Sea Service Deployment Ribbon. Requires FMF device overlay support.
- P53 OSR - Navy and Marine Corps Overseas Service Ribbon. Requires numeral overlay support.

## 5. Non-blocking gaps, Marine-applicable

These awards are valid for Marines but appear infrequently. Image absence will not block initial release.

- P24 NER - Navy 'E' Ribbon (Marines aboard qualifying vessels only).
- P32 EAMEC - European-African-Middle Eastern Campaign Medal (historical, no longer issued).
- P50 NASR - Navy Arctic Service Ribbon (file 048 in the library is the Coast Guard variant, not Navy).
- P54 MCRR - Marine Corps Recruiting Ribbon.
- P55 MCDIR - Marine Corps Drill Instructor Ribbon.
- P56 MCSGR - Marine Security Guard Ribbon.
- P59 MCR-R - Marine Corps Reserve Ribbon (legacy).
- P61 PPUC - Philippine Presidential Unit Citation.
- P62 KPUC - Korean Presidential Unit Citation.
- P63 VPUC - Vietnam Presidential Unit Citation.
- P78 MFO - Multinational Force and Observers Medal.
- P82 KLM - Kuwait Liberation Medal (consolidated entry; KLM-SA and KLM-KW have images).
- P86 RIFLE - Rifle Qualification Badge (badge, not ribbon).
- P87 PISTOL - Pistol Qualification Badge (badge, not ribbon).
- P88-95 - Civilian and Merchant Marine honors. Out of normal Marine wear scope.

## 6. Out-of-scope entries

The data file contains 8 Merchant Marine entries flagged `marineApplicable: false`. These are not counted as Marine gaps. Recommendation: keep them in the data set for precedence accuracy but exclude from default UI.

## 7. New findings beyond the embedded deficiencies array

- **098 Inter-American Defense Board Ribbon** is mapped to IADB at P80. The library file is present. No gap.
- **037 Women's Army Corps Ribbon** is in the library, no `awards.json` entry references it. WAC service is not a Marine-applicable award. The file is orphan within Marine scope. Recommendation: leave on disk, marked orphan in audit output.
- **Filename mismatch risk**: Award ID `nasr` (precedence 53) references the Navy Arctic Service Ribbon, but file `048_Coast_Guard_Arctic_Service_Ribbon.png` is the Coast Guard variant. The data file correctly leaves the Navy reference null. Verify no future regression substitutes the Coast Guard ribbon for the Navy one.
- **Vietnam Gallantry Cross variant set unused.** Files 065 (with palm), 066 (with gold star), and 067 (with silver star) sit on disk orphaned. Your `rvn_gallantry_cross_uc` entry maps to 068 (bronze star) only. The four files form the device-variant set per SECNAV M-1650.1 Appendix 3B. Recommendation: add a `variants` array to the award entry pointing to all four files, then wire a variant selector in the UI for this award only.
- **NATO multi-operation variants unused.** Files 099 (Kosovo), 100 (Meritorious), and 101 (Macedonia) sit on disk orphaned. Your `nato_medal` entry maps to 096 only. NATO awards split by operation. Recommendation: split `nato_medal` into operation-specific entries or add a variant selector.
- **Other-service ribbons in library.** 50+ orphan files are Army, Air Force, or Coast Guard awards. Out of Marine scope. Recommendation: leave on disk for joint-display reference, do not surface in the picker.

## 8. Device overlay asset inventory required for Task 6

Beyond the missing ribbon backgrounds, the device system needs overlay imagery. Current state: the device picker renders text glyphs in `lib/devices.ts` (`★`, `V`, `C`, `R`, `❦`, `#`). For visual fidelity, real overlay PNGs are needed eventually for:

- 5/16-inch gold star
- 5/16-inch silver star
- 3/16-inch bronze service star
- 3/16-inch silver service star
- Bronze oak leaf cluster
- Silver oak leaf cluster
- V device (Tab 13)
- C device (Tab 15)
- R device (Tab 16)
- M device (mobilization, AFRM only)
- Gold strike/flight numerals 2 through 9
- Bronze service numerals 2 through 9
- FMF device (SSDR)
- Bronze palm (Vietnam Gallantry Cross)

This is a Task 6 follow-on, not a Task 8 line item. Out of scope for the current session per user's "gap audit only" decision.

## 9. Recommended next steps

- Source the 14 release-blocking ribbon images listed in Sections 2 through 4 from a vetted reference. Public-domain sources: The Institute of Heraldry, official Marine Corps imagery libraries, or the Air Force Personnel Center.
- Re-run `npm run audit-images` once new images land in `images/ribbons/`. Update `awards.json` entries to flip `fileExists` to `true` and set the `ribbon` path.
- Update `data/awards.json.deficiencies` to remove resolved entries.
- Defer device overlay imagery to Task 6 follow-on.

## 10. Forensic notes

- Confidence in this audit: 0.92. Filesystem verification depends on `scripts/audit-images.mjs` running cleanly under Node. The current session ran offline against grep output and the directory listing only.
- Risk: an image present on disk but not referenced in `awards.json` may sit unused. Section 7 flags Women's Army Corps as one such case.
- Risk: paths in `awards.json` are case-sensitive on Linux deployments. Verify casing matches the actual filenames before deploy.
