/**
 * ステータスの種類
 */
export type StatType =
  | 'speed'      // おてつだいスピード
  | 'stamina'    // げんき回復量
  | 'ingredient' // 食材確率
  | 'skill'      // スキル確率
  | 'exp'        // EXP獲得量
  | 'neutral';   // 補正なし

/**
 * カラーテーマの種類
 */
export type ColorTheme =
  | 'amber'  // おてつだいスピード
  | 'green'  // げんき回復量
  | 'red'    // 食材確率
  | 'purple' // スキル確率
  | 'blue'   // EXP獲得量
  | 'gray';  // 補正なし

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

/**
 * 性格補正の効果値（計算用）
 */
export interface NatureEffect {
  /** 性格名 */
  name: string;
  /** おてつだいスピード補正（1.0が基準） */
  speedMultiplier: number;
  /** 食材確率補正（1.0が基準） */
  ingredientMultiplier: number;
  /** スキル確率補正（1.0が基準） */
  skillMultiplier: number;
}
