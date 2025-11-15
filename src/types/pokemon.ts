/**
 * ポケモンのとくいタイプ
 */
export type TokuiType = "きのみ" | "食材" | "スキル" | "オール";

/**
 * ポケモンデータの型定義
 */
export interface Pokemon {
  /** ポケモン図鑑番号 */
  number: number;
  /** 表示用ポケモン名（日本語） */
  displayName: string;
  /** ポケモン名（英語） */
  enName: string;
  /** データ用ポケモン名（英語） */
  name: string;
  /** とくい（きのみ、食材、スキル） */
  type: TokuiType;
  /** メインスキル */
  mainSkill: string;
  /** 基準おてつだい時間（秒） */
  supportTime: number;
  /** 基準食材確率 */
  foodDropRate: number;
  /** 基準スキル確率 */
  skillRate: number;
  /** きのみの種類（英語） */
  kinomiType: string;
}
