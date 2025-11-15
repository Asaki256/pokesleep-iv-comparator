/**
 * ステータスの種類
 */
export type StatType =
  | "speed" // おてつだいスピード
  | "stamina" // げんき回復量
  | "ingredient" // 食材確率
  | "skill" // スキル確率
  | "exp" // EXP獲得量
  | "neutral"; // 補正なし

/**
 * カラーテーマの種類
 */
export type ColorTheme =
  | "amber" // おてつだいスピード
  | "green" // げんき回復量
  | "red" // 食材確率
  | "purple" // スキル確率
  | "blue" // EXP獲得量
  | "gray"; // 補正なし

/**
 * 性格データの型
 */
export interface Nature {
  /** 性格名（日本語） */
  name: string;
  /** 上昇ステータス（nullの場合は補正なし） */
  up: string | null;
  /** 下降ステータス（nullの場合は補正なし） */
  down: string | null;
  /** おてつだい時間への補正（0.9=速くなる, 1.075=遅くなる, 1.0=補正なし） */
  speedMultiplier: number;
  /** 食材確率への補正（1.2=上昇, 0.8=下降, 1.0=補正なし） */
  ingredientMultiplier: number;
  /** スキル確率への補正（1.2=上昇, 0.8=下降, 1.0=補正なし） */
  skillMultiplier: number;
}

/**
 * 性格グループの型
 */
export interface NatureGroup {
  /** グループID */
  id: StatType;
  /** グループ表示名 */
  name: string;
  /** カラーテーマ */
  color: ColorTheme;
  /** グループに属する性格のリスト */
  natures: Nature[];
}

/**
 * 選択済み性格の型
 */
export interface SelectedNature extends Nature {
  /** 性格のカラーテーマ */
  color: ColorTheme;
}

/**
 * カラー設定の型
 */
export interface ColorConfig {
  /** グラデーション背景 */
  gradient: string;
  /** ボーダー色 */
  border: string;
  /** ボタン背景 */
  button: string;
  /** 選択時の背景 */
  selected: string;
  /** バッジ背景 */
  badge: string;
  /** テキスト色 */
  text: string;
  /** アイコン背景 */
  icon: string;
}
