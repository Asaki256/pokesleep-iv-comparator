import { NatureGroup, ColorConfig, NatureEffect } from '@/types/nature';

/**
 * 性格グループデータ（25種類）
 */
export const NATURE_GROUPS: NatureGroup[] = [
  {
    id: 'speed',
    name: 'おてつだいスピード',
    color: 'blue',
    natures: [
      { name: 'さみしがり', up: 'スピード', down: 'げんき回復' },
      { name: 'いじっぱり', up: 'スピード', down: '食材確率' },
      { name: 'やんちゃ', up: 'スピード', down: 'スキル確率' },
      { name: 'ゆうかん', up: 'スピード', down: 'EXP獲得' },
    ]
  },
  {
    id: 'stamina',
    name: 'げんき回復量',
    color: 'green',
    natures: [
      { name: 'ずぶとい', up: 'げんき回復', down: 'スピード' },
      { name: 'わんぱく', up: 'げんき回復', down: '食材確率' },
      { name: 'のうてんき', up: 'げんき回復', down: 'スキル確率' },
      { name: 'のんき', up: 'げんき回復', down: 'EXP獲得' },
    ]
  },
  {
    id: 'ingredient',
    name: '食材確率',
    color: 'red',
    natures: [
      { name: 'ひかえめ', up: '食材確率', down: 'スピード' },
      { name: 'おっとり', up: '食材確率', down: 'げんき回復' },
      { name: 'うっかりや', up: '食材確率', down: 'スキル確率' },
      { name: 'れいせい', up: '食材確率', down: 'EXP獲得' },
    ]
  },
  {
    id: 'skill',
    name: 'スキル確率',
    color: 'purple',
    natures: [
      { name: 'おだやか', up: 'スキル確率', down: 'スピード' },
      { name: 'おとなしい', up: 'スキル確率', down: 'げんき回復' },
      { name: 'しんちょう', up: 'スキル確率', down: '食材確率' },
      { name: 'なまいき', up: 'スキル確率', down: 'EXP獲得' },
    ]
  },
  {
    id: 'exp',
    name: 'EXP獲得量',
    color: 'amber',
    natures: [
      { name: 'おくびょう', up: 'EXP獲得', down: 'スピード' },
      { name: 'せっかち', up: 'EXP獲得', down: 'げんき回復' },
      { name: 'ようき', up: 'EXP獲得', down: '食材確率' },
      { name: 'むじゃき', up: 'EXP獲得', down: 'スキル確率' },
    ]
  },
  {
    id: 'neutral',
    name: '補正なし',
    color: 'gray',
    natures: [
      { name: 'てれや', up: null, down: null },
      { name: 'がんばりや', up: null, down: null },
      { name: 'すなお', up: null, down: null },
      { name: 'きまぐれ', up: null, down: null },
      { name: 'まじめ', up: null, down: null },
    ]
  },
];

/**
 * カラーテーマ設定（Tailwind CSS class names）
 */
export const COLOR_CONFIG: Record<string, ColorConfig> = {
  amber: {
    gradient: 'from-amber-50 to-yellow-50',
    border: 'border-amber-200',
    button: 'bg-white border-amber-200 hover:bg-amber-50',
    selected: 'bg-amber-100 border-amber-300',
    badge: 'bg-amber-500',
    text: 'text-amber-700',
    icon: 'bg-amber-100 text-amber-700',
  },
  green: {
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-200',
    button: 'bg-white border-green-200 hover:bg-green-50',
    selected: 'bg-green-100 border-green-300',
    badge: 'bg-green-500',
    text: 'text-green-700',
    icon: 'bg-green-100 text-green-700',
  },
  red: {
    gradient: 'from-red-50 to-rose-50',
    border: 'border-red-200',
    button: 'bg-white border-red-200 hover:bg-red-50',
    selected: 'bg-red-100 border-red-300',
    badge: 'bg-red-500',
    text: 'text-red-700',
    icon: 'bg-red-100 text-red-700',
  },
  purple: {
    gradient: 'from-purple-50 to-violet-50',
    border: 'border-purple-200',
    button: 'bg-white border-purple-200 hover:bg-purple-50',
    selected: 'bg-purple-100 border-purple-300',
    badge: 'bg-purple-500',
    text: 'text-purple-700',
    icon: 'bg-purple-100 text-purple-700',
  },
  blue: {
    gradient: 'from-blue-50 to-sky-50',
    border: 'border-blue-200',
    button: 'bg-white border-blue-200 hover:bg-blue-50',
    selected: 'bg-blue-100 border-blue-300',
    badge: 'bg-blue-500',
    text: 'text-blue-700',
    icon: 'bg-blue-100 text-blue-700',
  },
  gray: {
    gradient: 'from-gray-50 to-slate-50',
    border: 'border-gray-200',
    button: 'bg-white border-gray-200 hover:bg-gray-50',
    selected: 'bg-gray-100 border-gray-300',
    badge: 'bg-gray-500',
    text: 'text-gray-700',
    icon: 'bg-gray-100 text-gray-700',
  },
};

/**
 * 性格補正効果値（計算用）
 * 仕様書のステータス別補正値に基づく
 */
export const NATURE_EFFECTS: Record<string, NatureEffect> = {
  // おてつだいスピード↑
  'さみしがり': { name: 'さみしがり', speedMultiplier: 1.11, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'いじっぱり': { name: 'いじっぱり', speedMultiplier: 1.11, ingredientMultiplier: 0.8, skillMultiplier: 1.0 },
  'やんちゃ': { name: 'やんちゃ', speedMultiplier: 1.11, ingredientMultiplier: 1.0, skillMultiplier: 0.8 },
  'ゆうかん': { name: 'ゆうかん', speedMultiplier: 1.11, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },

  // げんき回復量↑
  'ずぶとい': { name: 'ずぶとい', speedMultiplier: 0.91, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'わんぱく': { name: 'わんぱく', speedMultiplier: 1.0, ingredientMultiplier: 0.8, skillMultiplier: 1.0 },
  'のうてんき': { name: 'のうてんき', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 0.8 },
  'のんき': { name: 'のんき', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },

  // 食材確率↑
  'ひかえめ': { name: 'ひかえめ', speedMultiplier: 0.91, ingredientMultiplier: 1.2, skillMultiplier: 1.0 },
  'おっとり': { name: 'おっとり', speedMultiplier: 1.0, ingredientMultiplier: 1.2, skillMultiplier: 1.0 },
  'うっかりや': { name: 'うっかりや', speedMultiplier: 1.0, ingredientMultiplier: 1.2, skillMultiplier: 0.8 },
  'れいせい': { name: 'れいせい', speedMultiplier: 1.0, ingredientMultiplier: 1.2, skillMultiplier: 1.0 },

  // スキル確率↑
  'おだやか': { name: 'おだやか', speedMultiplier: 0.91, ingredientMultiplier: 1.0, skillMultiplier: 1.2 },
  'おとなしい': { name: 'おとなしい', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.2 },
  'しんちょう': { name: 'しんちょう', speedMultiplier: 1.0, ingredientMultiplier: 0.8, skillMultiplier: 1.2 },
  'なまいき': { name: 'なまいき', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.2 },

  // EXP獲得量↑
  'おくびょう': { name: 'おくびょう', speedMultiplier: 0.91, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'せっかち': { name: 'せっかち', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'ようき': { name: 'ようき', speedMultiplier: 1.0, ingredientMultiplier: 0.8, skillMultiplier: 1.0 },
  'むじゃき': { name: 'むじゃき', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 0.8 },

  // 補正なし
  'てれや': { name: 'てれや', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'がんばりや': { name: 'がんばりや', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'すなお': { name: 'すなお', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'きまぐれ': { name: 'きまぐれ', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
  'まじめ': { name: 'まじめ', speedMultiplier: 1.0, ingredientMultiplier: 1.0, skillMultiplier: 1.0 },
};
