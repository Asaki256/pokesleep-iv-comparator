export type Rarity = "gold" | "blue" | "gray";

export interface SubSkill {
  displayName: string;
  name: string;
  rarity: Rarity;
  skillGroup: string;
}
