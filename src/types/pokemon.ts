/**
 * ポケモンのとくいタイプ
 */
export type TokuiType = "きのみ" | "食材" | "スキル";

/**
 * ポケモンデータの型定義
 */
export interface Pokemon {
  /** 表示用ポケモン名（日本語） */
  displayName: string;
  /** データ用ポケモン名（英語） */
  name: string;
  /** とくい（きのみ、食材、スキル） */
  type: TokuiType;
  /** 基準おてつだい時間（秒） */
  supportTime: number;
  /** 基準食材確率 */
  foodDropRate: number;
  /** 基準スキル確率 */
  skillRate: number;
  /** きのみの種類（英語） */
  kinomiType: string;
}
