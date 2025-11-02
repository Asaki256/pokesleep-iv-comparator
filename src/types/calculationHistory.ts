import { CalculationResult } from "@/utils/pokemonCalculator";
import { SelectedSubSkill } from "@/types/selectedSubSkill";

/**
 * 計算履歴アイテムの型定義
 */
export interface CalculationHistoryItem {
  /** 一意のID (UUID) */
  id: string;

  /** 計算実行日時 (Unix timestamp) */
  timestamp: number;

  /** ポケモン表示名 */
  pokemonName: string;

  /** ポケモンの内部名（再表示用） */
  pokemonInternalName: string;

  /** とくいタイプ（きのみ、食材、スキル、オール） */
  pokemonType?: string;

  /** 性格名（再表示用） */
  natureName?: string;

  /** 性格（表示用テキスト） */
  natureDisplay?: string;

  /** 選択されたサブスキル */
  subSkills: SelectedSubSkill[];

  /** 計算結果 */
  calculationResult: CalculationResult;
}
