import awardsJson from "@/data/awards.json";
import type { Award, AwardsData } from "./types";

// Static import. awards.json is build-time content per session decision.
const data = awardsJson as unknown as AwardsData;

export const awardsData: AwardsData = data;

export const allAwards: Award[] = data.awards;

// Marine-applicable awards eligible for rack display. Marksmanship badges
// (rifle and pistol qualification) live in awards.json for completeness but
// are worn as badges, not ribbons, per MCO 1020.34H §5103. They are filtered
// out of the rack-builder picker.
export const marineAwards: Award[] = data.awards
  .filter((a) => a.marineApplicable)
  .filter((a) => a.category !== "marksmanship")
  .sort((a, b) => a.precedence - b.precedence);

export function getAwardById(id: string): Award | undefined {
  return allAwards.find((a) => a.id === id);
}

export function getAwardByPrecedence(p: number): Award | undefined {
  return allAwards.find((a) => a.precedence === p);
}
