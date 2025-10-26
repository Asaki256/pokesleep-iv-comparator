import { Rarity } from "./subSkill";

export type Variant = "M" | "S" | "L";

export interface SelectedSubSkill {
  id: string; // ユニークID（選択時に生成）
  baseId: string; // データのID（name）
  name: string; // 表示名
  variant: Variant | null;
  level: number; // 10, 25, 50, 75, 100
  rarity: Rarity;
}
