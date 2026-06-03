# Awards Data Schema - Rack Builder

Source documents:
- MCO 1020.34H (Marine Corps Uniform Regulations, 01 May 2018) - precedence, wear rules, rack assembly
- SECNAV M-1650.1 (Navy and Marine Corps Awards Manual, 16 Aug 2019) - criteria, eligibility, devices
- SECNAVINST 1650.1J (DON Awards Policy, 29 May 2019) - policy framework

## Top-level structure

```json
{
  "schemaVersion": "1.0.0",
  "lastUpdated": "2026-05-25",
  "sourceCitations": {
    "precedence": "MCO 1020.34H §5102",
    "criteria": "SECNAV M-1650.1",
    "policy": "SECNAVINST 1650.1J"
  },
  "awards": [ /* Award objects */ ],
  "categories": [ /* Category metadata */ ],
  "devices": [ /* Device metadata */ ],
  "deficiencies": [ /* Known gaps requiring sourcing */ ]
}
```

## Award object schema

```json
{
  "id": "moh",
  "precedence": 1,
  "category": "pmd",
  "name": "Medal of Honor",
  "shortName": "MOH",
  "abbreviation": "MOH",
  "marineApplicable": true,
  "issuingAuthority": "President of the United States",
  "approvingAuthority": "President in the name of Congress",
  "statutoryReference": "10 U.S.C. §8291",
  "effectiveDate": "1861-04-12",
  "image": {
    "ribbon": "/images/ribbons/moh_ribbon.png",
    "medal": "/images/medals/moh_medal.png",
    "fileExists": false
  },
  "criteria": {
    "summary": "Awarded by the President, in the name of Congress, to a member of the U.S. Naval Service for conspicuous gallantry and intrepidity at the risk of his or her own life above and beyond the call of duty.",
    "conditions": [
      "Engaged in an action against an enemy of the United States",
      "Engaged in military operations involving conflict with an opposing foreign force",
      "Serving with friendly foreign forces engaged in armed conflict against an opposing armed force in which the United States is not a belligerent party"
    ],
    "standard": "There must be no margin of doubt or possibility of error in awarding this honor."
  },
  "devices": {
    "authorized": [],
    "subsequentAwardMarker": "none",
    "notes": "Subsequent awards represented separately per SECNAV M-1650.1 Tab 1."
  },
  "sourceCitations": {
    "precedence": "MCO 1020.34H §5102.5.a (line 7213)",
    "criteria": "SECNAV M-1650.1 Tab 1 (lines 1513-1604)",
    "wear": "MCO 1020.34H §5202.1 (line 7626)"
  },
  "wearNotes": "Worn around the neck on dress uniforms. Will not be mounted nor reproduced in miniature.",
  "uniformContext": ["dress_a", "blue_dress", "evening_dress"]
}
```

## Category enumeration

| ID | Label | MCO 1020.34H §5102 reference |
|----|-------|------------------------------|
| pmd | U.S. Personal Decorations | §5102.5 (lines 7212-7236) |
| unit | Navy Unit Awards | §5102.6 (lines 7237-7245) |
| nonmilitary_personal | U.S. Nonmilitary Personal Decorations | §5102.7 (lines 7246-7287) |
| ces | Campaign and Service Awards | §5102.8 (lines 7288-7354) |
| nonmilitary_service | Nonmilitary Service Awards | §5102.9 (lines 7355-7379) |
| foreign_personal | Foreign Personal Decorations | §5102.10 (lines 7380-7388) |
| foreign_unit | Foreign Unit Awards | §5102.11 (lines 7389-7403) |
| non_us_service | Non-U.S. Service Awards | §5102.12 (lines 7404-7449) |
| foreign_service | Foreign Service Awards | §5102.13 (lines 7450-7457) |
| marksmanship | Marksmanship Badges | §5500 (lines 8507+) |

## Device enumeration

| ID | Name | Size | Use | Source |
|----|------|------|-----|--------|
| star_gold_5_16 | 5/16-inch Gold Star | 5/16 in | Subsequent award, Navy/Marine PMDs and unit awards | SECNAV M-1650.1 multiple Tabs |
| star_silver_5_16 | 5/16-inch Silver Star | 5/16 in | Replaces 5 gold stars | SECNAV M-1650.1 multiple Tabs |
| star_bronze_3_16 | 3/16-inch Bronze Star | 3/16 in | Service stars (campaign participation), marksmanship | SECNAV M-1650.1 §9023, §6259 |
| star_silver_3_16 | 3/16-inch Silver Star | 3/16 in | Replaces 5 bronze service stars | SECNAV M-1650.1 §9020 |
| oak_leaf_bronze | Bronze Oak Leaf Cluster | - | Subsequent DoD/Joint awards only | DoD policy per MCO 1020.34H §5400.3.a.(3) |
| oak_leaf_silver | Silver Oak Leaf Cluster | - | Replaces 5 bronze oak leaves on DoD/Joint awards | DoD policy |
| v_device | Combat "V" Device | - | Valor in physical combat | SECNAV M-1650.1 Tab 13 (line 2821) |
| c_device | Combat "C" Device | - | Meritorious achievement under combat conditions | SECNAV M-1650.1 Tab 15 (line 3028) |
| r_device | Remote "R" Device | - | Remote impact on combat operations | SECNAV M-1650.1 Tab 16 (line 3124) |
| numeral_gold | Gold Numeral | - | Strike/flight count on Air Medal | SECNAV M-1650.1 §2372 |
| clasp | Clasp | - | Specific awards (Sea Service, MCEM) | per award |
| arrowhead | Bronze Arrowhead | - | Combat parachute jump or amphibious assault | per award |
| globe_anchor | Bronze Marine Corps Emblem | - | Joint service medals when earned with Marine Corps | SECNAV M-1650.1 §6797 |

## Rack stacking rules (MCO 1020.34H §5301)

```json
{
  "rowsDefault": 3,
  "rowsMax": 4,
  "topDownOrdering": true,
  "rightToLeftOrdering": true,
  "topRowAlignment": "centered_over_row_below",
  "lowerRowAlignment": "outer_edge_vertical",
  "incompleteRowPosition": "top",
  "femaleTwoRibbonRowAllowed": true,
  "rowSpacing": ["1/8_inch", "flush"]
}
```

## Deficiency tracking schema

```json
{
  "type": "missing_image | naming_mismatch | criteria_gap | precedence_ambiguity",
  "awardId": "purple_heart",
  "description": "Purple Heart image not present in images/ribbons/",
  "blocksRelease": true,
  "resolution": "Source authentic ribbon image from official Navy supply or commission"
}
```
