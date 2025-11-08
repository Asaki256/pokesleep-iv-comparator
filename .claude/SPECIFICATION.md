# Pokesleep IV Comparator - 完全仕様書

**注意**: この仕様書は実際のコード実装を基に作成された正式な仕様書です。コードの実装内容が正しい仕様となります。

## 目次

1. [仕様書メンテナンスルール](#仕様書メンテナンスルール)
2. [プロジェクト概要](#プロジェクト概要)
3. [技術スタック](#技術スタック)
4. [アーキテクチャとディレクトリ構成](#アーキテクチャとディレクトリ構成)
5. [データ構造](#データ構造)
6. [計算ロジック](#計算ロジック)
7. [コンポーネント構造](#コンポーネント構造)
8. [ユーザーフロー](#ユーザーフロー)
9. [重要な実装の詳細](#重要な実装の詳細)

---

## 仕様書メンテナンスルール

### 基本方針

この仕様書は**実際のコード実装の信頼できる情報源**として機能します。コードと仕様書の同期を保つため、以下のルールに従ってください。

### 仕様書更新が必要なケース

以下のような変更を行った場合、**必ず**仕様書も更新してください：

#### 1. 計算ロジックの変更
- 計算式の変更・追加・削除
- 定数値の変更（`SECONDS_PER_DAY`、サブスキル補正値など）
- 計算フローの変更

**例**: サブスキルの補正値を`0.36`から`0.40`に変更した場合
→ 「計算ロジック」セクションの該当箇所と例を更新

#### 2. データ構造の変更
- 型定義の追加・変更（`Pokemon`、`Nature`、`SubSkill`など）
- 新しいプロパティの追加
- プロパティの削除・名前変更

**例**: `Pokemon`型に`region: string`プロパティを追加した場合
→ 「データ構造」セクションの`Pokemon型`の定義と説明を更新

#### 3. 新機能の追加
- 新しいコンポーネントの追加
- 新しい計算タイプの追加
- 新しいユーザー機能の追加

**例**: レベル可変機能を実装した場合
→ 「コンポーネント構造」「ユーザーフロー」セクションを更新
→ 「注意事項・制約」から「レベルは60固定」の記載を削除

#### 4. アーキテクチャの変更
- ディレクトリ構成の変更
- 新しいファイル・モジュールの追加
- 依存関係の大きな変更

**例**: `src/api/`ディレクトリを追加してバックエンド連携を実装した場合
→ 「技術スタック」「アーキテクチャとディレクトリ構成」セクションを更新

### 更新不要なケース

以下の変更では仕様書の更新は不要です：

- バグ修正（ロジックや仕様に影響しない場合）
- スタイリングの微調整
- リファクタリング（外部仕様が変わらない場合）
- テストコードの追加・修正
- ドキュメントコメントの改善

### 更新時の注意事項

#### ✅ 推奨事項

1. **具体例を含める**: 計算式や型定義には必ず実例を記載する
2. **コード参照を明記**: 該当するファイルパスと行番号を記載する
3. **実装を正確に記述**: コードの実装内容を正確に反映する
4. **更新履歴を記録**: ファイル末尾の「更新履歴」セクションを更新する

#### ❌ 避けるべき事項

1. **曖昧な記述**: 「おそらく」「たぶん」などの推測表現
2. **古い情報の放置**: 削除された機能の記述を残さない
3. **不完全な更新**: 関連セクションの更新漏れ
4. **コードとの不一致**: 実装と異なる説明

### 更新フロー

```
コード変更
  ↓
仕様書更新が必要か判断
  ↓ (必要な場合)
該当セクションを特定
  ↓
内容を更新（例、コード参照も含む）
  ↓
関連セクションも確認・更新
  ↓
「最終更新」セクションを更新
  ↓
コミット時に仕様書も含める
```

### コミットメッセージの推奨フォーマット

仕様書を更新する場合、コミットメッセージに明記してください：

```
feat: Add level selector component

- Implement level selection UI (10-100)
- Update calculation logic to use selected level
- Update SPECIFICATION.md:
  - Add LevelSelector component to component structure
  - Remove "level fixed at 60" constraint
  - Update user flow section
```

### 定期的な見直し

- **大規模リファクタリング後**: 全体を見直して整合性を確認
- **メジャーバージョンアップ時**: 技術スタックや依存関係を確認
- **四半期ごと**: 「今後の拡張可能性」セクションの見直し

---

## プロジェクト概要

### 目的
ポケモンスリープ（Pokemon Sleep）のポケモン個体値比較ツール。サブスキルと性格の組み合わせによる理論値との比較を行い、きのみ・食材・スキルの各特化タイプでランキング表示を提供します。

### 解決する課題
- サブスキル組み合わせの理論最大値が不明瞭
- 特定の組み合わせが全体でどの程度のランクかわからない
- 現在のポケモンが理論値とどれだけ離れているか把握できない

### ターゲットユーザー
日本語話者のポケモンスリーププレイヤー

---

## 技術スタック

### フロントエンド
- **フレームワーク**: Next.js 16 (App Router)
- **UIライブラリ**: React 19
- **言語**: TypeScript (strict mode)
- **スタイリング**: Tailwind CSS v4
- **UIコンポーネント**: Radix UI (shadcn/ui)
- **テーマ**: next-themes (ダークモード対応)

### テスティング
- **テストランナー**: Vitest
- **コンポーネントテスト**: React Testing Library
- **環境**: JSDOM

### デプロイ
- **ホスティング**: クライアントサイドのみ（静的サイト）
- **バックエンド**: なし（全データはローカルTypeScriptファイル）

---

## アーキテクチャとディレクトリ構成

```
pokesleep-iv-comparator/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # ルートレイアウト（メタデータ、テーマプロバイダ）
│   └── page.tsx                 # メインページ（コンポーネント統合）
├── src/
│   ├── components/              # React コンポーネント
│   │   ├── Search.tsx          # メイン検索・計算コンポーネント
│   │   ├── CalculatedPokemonInfo.tsx  # 計算結果表示
│   │   ├── CombinationRanking.tsx     # ランキングテーブル
│   │   ├── PokeNameCombobox.tsx       # ポケモン選択
│   │   ├── SubSkillSelect/            # サブスキル選択UI
│   │   ├── nature/                     # 性格選択UI
│   │   └── ui/                         # Radix UIベースコンポーネント
│   ├── data/                    # 静的データ
│   │   ├── pokemonData.ts      # 1000+のポケモンデータ
│   │   ├── natureData.ts       # 25種類の性格データ
│   │   ├── subSkillData.ts     # 17種類のサブスキル
│   │   └── kinomiData.ts       # 17種類のきのみデータ
│   ├── types/                   # TypeScript型定義
│   ├── utils/                   # ユーティリティ関数
│   │   ├── pokemonCalculator.ts  # コア計算ロジック
│   │   ├── rankingGenerator.ts   # ランキング生成
│   │   ├── subSkillUtils.ts      # サブスキルヘルパー
│   │   └── kanaConverter.ts      # かな変換ユーティリティ
│   ├── hooks/                   # カスタムReact Hooks
│   │   ├── useCalculationHistory.ts
│   │   ├── useNatureSelector.ts
│   │   └── useVirtualScroll.ts
│   ├── lib/                     # 共有ライブラリ
│   │   └── storage/             # LocalStorage管理
│   └── services/                # 外部サービス
│       └── pokeApi.ts          # PokeAPI連携
└── public/                      # 静的アセット
```

---

## データ構造

### Pokemon型 (src/types/pokemon.ts)

```typescript
type TokuiType = "きのみ" | "食材" | "スキル" | "オール";

interface Pokemon {
  number: number;           // 図鑑番号
  displayName: string;      // 表示名（日本語）
  enName: string;          // 英語名
  name: string;            // 内部データ名（小文字）
  type: TokuiType;         // 得意タイプ
  mainSkill: string;       // メインスキル名
  supportTime: number;     // 基準おてつだい時間（秒）
  foodDropRate: number;    // 基準食材確率（0.0-1.0）
  skillRate: number;       // 基準スキル確率（0.0-1.0）
  kinomiType: string;      // きのみタイプ識別子
}
```

**データ所在**: `src/data/pokemonData.ts` (2,564行, 1000+エントリ)

### Nature型 (src/types/nature.ts)

```typescript
type StatType = 'speed' | 'stamina' | 'ingredient' | 'skill' | 'exp' | 'neutral';

interface Nature {
  name: string;                    // 性格名（日本語）
  up: string | null;              // 上昇補正（"スピード"等）
  down: string | null;            // 下降補正
  speedMultiplier: number;        // おてつだいスピード補正（0.9 or 1.0 or 1.075）
  ingredientMultiplier: number;   // 食材確率補正（0.8 or 1.0 or 1.2）
  skillMultiplier: number;        // スキル確率補正（0.8 or 1.0 or 1.2）
}

interface NatureGroup {
  id: string;                      // "speed", "ingredient"等
  name: string;                    // 表示名
  color: ColorTheme;               // カラーテーマ
  natures: Nature[];               // 性格配列（各グループ4-5個）
}
```

**性格補正値**:
- スピード上昇: `0.9` (おてつだい時間が10%短縮)
- スピード下降: `1.075` (おてつだい時間が7.5%増加)
- 食材/スキル上昇: `1.2` (確率20%増加)
- 食材/スキル下降: `0.8` (確率20%減少)

**データ所在**: `src/data/natureData.ts` (25種類、6グループ)

### SubSkill型 (src/types/subSkill.ts)

```typescript
type Rarity = "gold" | "blue" | "gray";

interface SubSkill {
  displayName: string;     // 表示名（日本語）
  name: string;           // 内部識別子
  rarity: Rarity;         // レアリティ（色分け用）
  skillGroup: string;     // バリアント用グループ（"supportSpeed"等）
}

interface SelectedSubSkill {
  id: string;             // ユニークID
  baseId: string;         // ベースとなるスキルID
  name: string;           // 表示名
  variant: "M" | "S" | "L" | null;  // バリアント（M/S/L）
  level: number;          // 解放レベル（10, 25, 50）
  rarity: Rarity;         // レアリティ
}
```

**サブスキル一覧** (17種類):

| 表示名 | 内部ID | レアリティ | バリアント | 効果 |
|--------|--------|-----------|-----------|------|
| おてつだいボーナス | helping_bonus | gold | なし | スピード軽減 5% |
| きのみの数S | berry_finding_s | gold | なし | きのみ+1個 |
| おてつだいスピードM | helping_speed_m | blue | M | スピード軽減 14% |
| おてつだいスピードS | helping_speed_s | gray | S | スピード軽減 7% |
| 食材確率アップM | ingredient_finder_m | blue | M | 食材確率+36% |
| 食材確率アップS | ingredient_finder_s | gray | S | 食材確率+18% |
| スキル確率アップM | skill_trigger_m | blue | M | スキル確率+36% |
| スキル確率アップS | skill_trigger_s | gray | S | スキル確率+18% |
| スキルレベルアップM/S | skill_level_up_m/s | gold/blue | M/S | (計算対象外) |
| 最大所持数アップL/M/S | inventory_up_l/m/s | blue/gray | L/M/S | (計算対象外) |
| その他ボーナス系 | *_bonus | gold | なし | (計算対象外) |

**データ所在**: `src/data/subSkillData.ts`

### Kinomi型 (src/data/kinomiData.ts)

```typescript
interface Kinomi {
  name: string;      // 表示名（日本語）
  type: string;      // タイプ識別子
  energy: number;    // 基礎エナジー値（24-35）
}
```

**データ所在**: `src/data/kinomiData.ts` (17種類)

---

## 計算ロジック

### 計算フローの全体像

```
ユーザー入力（ポケモン、性格、サブスキル）
  ↓
サブスキル集計（countSubSkills）
  ↓
性格補正値取得（getNatureMultipliers）
  ↓
おてつだい時間計算（calculateSupportTime）
  ↓
おてつだい回数/日計算（calculateHelpsPerDay）
  ↓
食材確率・スキル確率計算
  ↓
食材回数・スキル回数・きのみ回数計算
  ↓
きのみエナジー計算
  ↓
結果出力（CalculationResult）
```

### 定数

```typescript
const SECONDS_PER_DAY = 132888;           // 1日のおてつだい時間（秒）
const SUB_SKILL_REDUCTION_CAP = 0.35;     // サブスキル軽減上限（35%）
const SLEEP_RIBBON_MULTIPLIER = 1.0;      // おやすみリボン補正（固定）
```

### 計算式詳細

#### 1. レベル補正

```typescript
レベル補正 = 1 - (Lv - 1) × 0.002
```

**例**: Lv60の場合
```
1 - (60 - 1) × 0.002 = 1 - 0.118 = 0.882
```

**実装**: `src/utils/pokemonCalculator.ts:101-105`

---

#### 2. サブスキル軽減幅（スピード用）

```typescript
サブスキル軽減幅 = 0.14 × (おてつだいスピードMの個数)
                  + 0.07 × (おてつだいスピードSの個数)
                  + 0.05 × (おてつだいボーナスの個数)

// 上限: 0.35
サブスキル補正 = 1 - MIN(サブスキル軽減幅, 0.35)
```

**例**: スピードM×2 + スピードS×1 の場合
```
軽減幅 = 0.14 × 2 + 0.07 × 1 = 0.35 (上限到達)
補正 = 1 - 0.35 = 0.65
```

**実装**: `src/utils/pokemonCalculator.ts:112-122`

---

#### 3. おてつだい時間

```typescript
おてつだい時間 = Floor[
  基準おてつだい時間
  × レベル補正
  × おてつだいスピード性格補正
  × サブスキル補正
  × おやすみリボン補正
]
```

**例**: 基準3600秒、Lv60、性格「いじっぱり」(0.9)、スピードM×1 の場合
```
3600 × 0.882 × 0.9 × 0.86 × 1.0 = 2445.5 → Floor = 2445秒
```

**実装**: `src/utils/pokemonCalculator.ts:145-172`

---

#### 4. おてつだい回数/日

```typescript
おてつだい回数/日 = 132888 ÷ おてつだい時間
```

**例**: おてつだい時間2445秒の場合
```
132888 ÷ 2445 = 54.35回/日
```

**実装**: `src/utils/pokemonCalculator.ts:178-182`

---

#### 5. 食材確率

```typescript
食材確率 = 基準食材確率
          × (1 + 食材確率アップMの個数 × 0.36 + 食材確率アップSの個数 × 0.18)
          × 食材確率性格補正
```

**例**: 基準0.20、食材M×1、性格「ひかえめ」(1.2) の場合
```
0.20 × (1 + 1 × 0.36) × 1.2 = 0.20 × 1.36 × 1.2 = 0.3264 (32.64%)
```

**実装**: `src/utils/pokemonCalculator.ts:188-208`

---

#### 6. 食材お手伝い回数/日

```typescript
食材回数/日 = おてつだい回数/日 × 食材確率
```

**実装**: `src/utils/pokemonCalculator.ts:214-219`

---

#### 7. スキル確率

```typescript
スキル確率 = 基準スキル確率
            × (1 + スキル確率アップMの個数 × 0.36 + スキル確率アップSの個数 × 0.18)
            × スキル確率性格補正
```

**実装**: `src/utils/pokemonCalculator.ts:225-245`

---

#### 8. スキル回数の期待値/日

```typescript
スキル回数/日 = おてつだい回数/日 × スキル確率
```

**実装**: `src/utils/pokemonCalculator.ts:251-256`

---

#### 9. きのみお手伝い回数/日

```typescript
きのみ回数/日 = おてつだい回数/日 × (1 - 食材確率)
```

**実装**: `src/utils/pokemonCalculator.ts:262-267`

---

#### 10. きのみの数

```typescript
きのみの数 = 1                               // 基本1個
           + (タイプが「きのみ」または「オール」なら +1)
           + (きのみの数Sの個数)
```

**例**: きのみタイプ + きのみの数S×2 の場合
```
1 + 1 + 2 = 4個
```

**実装**: `src/utils/pokemonCalculator.ts:276-291`

---

#### 11. きのみエナジー/回

```typescript
きのみエナジー/回 = MAX[
  基礎エナジー + (Lv - 1),                    // 線形成長
  基礎エナジー × 1.025^(Lv - 1)               // 指数成長
] × きのみの数
```

**例**: 基礎エナジー27、Lv60、きのみの数2個 の場合
```
線形: 27 + 59 = 86
指数: 27 × 1.025^59 = 27 × 4.389 = 118.5
MAX[86, 118.5] × 2 = 237エナジー/回
```

**実装**: `src/utils/pokemonCalculator.ts:298-320`

---

#### 12. きのみエナジー/日

```typescript
きのみエナジー/日 = Floor[きのみ回数/日 × きのみエナジー/回]
```

**実装**: `src/utils/pokemonCalculator.ts:326-331`

---

### 計算結果の型

```typescript
interface CalculationResult {
  calculatedSupportTime: number;      // おてつだい時間(秒)
  calculatedFoodDropRate: number;     // 食材確率
  foodHelpsPerDay: number;            // 食材回数/日
  calculatedSkillRate: number;        // スキル確率
  skillTriggersPerDay: number;        // スキル回数/日
  berryHelpsPerDay: number;           // きのみ回数/日
  berryEnergyPerDay: number;          // きのみエナジー/日
}
```

---

## ランキング生成ロジック

### ランキングの種類

3種類のランキングを独立して生成:

1. **スキルランキング** - `skillTriggersPerDay`でソート
2. **食材ランキング** - `foodHelpsPerDay`でソート
3. **きのみランキング** - `berryEnergyPerDay`でソート

### サブスキル組み合わせ生成

各ランキングタイプで関連するサブスキルのみを組み合わせ生成:

```typescript
// スキルランキング用
const SKILL_RANKING_SKILLS = [
  "helping_speed_m", "helping_speed_s", "helping_bonus",
  "skill_trigger_m", "skill_trigger_s"
];

// 食材ランキング用
const INGREDIENT_RANKING_SKILLS = [
  "helping_speed_m", "helping_speed_s", "helping_bonus",
  "ingredient_finder_m", "ingredient_finder_s"
];

// きのみランキング用
const BERRY_RANKING_SKILLS = [
  "helping_speed_m", "helping_speed_s", "helping_bonus",
  "berry_finding_s"
];
```

### 組み合わせパターン

- 0個（サブスキルなし）
- 1個の組み合わせ
- 2個の組み合わせ
- 3個の組み合わせ

**自動レベル割り当て**:
- 1個目: Lv10
- 2個目: Lv25
- 3個目: Lv50

### ランキング生成フロー

```typescript
for (各性格 in 全25種類) {
  for (各サブスキル組み合わせ) {
    計算実行
    エントリ追加
  }
}
スコアでソート（降順）
ランク番号付与（1, 2, 3...）
```

### ユーザーランクの保証

ユーザーの選択した組み合わせがランキングに存在しない場合:
1. 計算を実行
2. ランキングに追加
3. 再ソート
4. ランク番号再付与

**実装**: `src/utils/rankingGenerator.ts:285-349`

---

## コンポーネント構造

### ページ階層

```
app/page.tsx (ホームページ)
├── Header              # ページヘッダー
├── Description         # アプリ説明
├── Rank                # ランク表示エリア
├── Result              # 結果表示エリア
└── Search              # メインロジックコンテナ（最重要コンポーネント）
```

### Search コンポーネント (src/components/Search.tsx)

**役割**: アプリケーションのメインロジックを統括

**状態管理**:
```typescript
- selectedPokemon: Pokemon | null           // 選択ポケモン
- selectedNature: SelectedNature | null     // 選択性格
- selectedSubSkills: SelectedSubSkill[]     // 選択サブスキル（最大3個）
- calculationResult: CalculationResult | null
- rankings: { skill, ingredient, berry }
- history: CalculationHistoryItem[]
- activeTab: "rank" | "history"
```

**主要機能**:
1. ポケモン選択処理
2. 性格・サブスキル選択処理
3. 計算実行とランキング生成
4. 履歴保存・復元
5. タブ切り替え

**子コンポーネント**:
```
Search
├── PokeNameCombobox           # ポケモン選択ドロップダウン
├── SubSkillSelect             # サブスキル選択（最大3個）
│   └── SkillPickerModal
│       ├── SkillListView
│       └── SkillCard
├── NatureSelector             # 性格選択
│   └── NatureBottomSheet
│       ├── NatureGroup (×6)
│       └── NatureButton
├── CalculatedPokemonInfo      # 計算結果カード表示
├── ResultTabs                 # タブナビゲーション
├── CombinationRanking         # ランキングテーブル
│   └── IVAnalysisComponent   # ランク要約
└── HistoryList                # 履歴リスト
    └── HistoryItem[]          # 履歴エントリ（展開可能）
```

### PokeNameCombobox (src/components/PokeNameCombobox.tsx)

**役割**: ポケモン選択のコンボボックス（検索可能）

**機能**:
- 1000+ポケモンの仮想スクロール対応
- かな変換対応検索（カタカナ/ひらがな両対応）
- Radix UIのCommand + Popoverベース
- キーボード操作対応

**使用Hook**: `useVirtualScroll`

---

### SubSkillSelect (src/components/SubSkillSelect/)

**役割**: サブスキル選択UI（最大3個まで）

**構造**:
```
SubSkillSelect (親コンポーネント)
├── SkillPickerModal       # モーダル選択画面
├── SkillListView          # スキルリスト表示
└── SkillCard              # 個別スキルカード
```

**機能**:
- ドラッグ&ドロップでの並び替え
- バリアント選択（M/S/L）
- レベル表示（10/25/50）
- レアリティ別色分け（Gold/Blue/Gray）

**バリアント対応スキル**:
- おてつだいスピード (M/S)
- 食材確率アップ (M/S)
- スキル確率アップ (M/S)
- スキルレベルアップ (M/S)
- 最大所持数アップ (L/M/S)

---

### NatureSelector (src/components/nature/)

**役割**: 性格選択UI

**構造**:
```
NatureSelector (親コンポーネント)
└── NatureBottomSheet (モーダル選択画面)
    ├── NatureGroup (×6グループ)
    └── NatureButton (各性格ボタン)
```

**性格グループ** (6種類):
1. おてつだいスピード (4種類) - blue
2. げんき回復量 (4種類) - green
3. 食材確率 (4種類) - red
4. スキル確率 (4種類) - purple
5. EXP獲得量 (4種類) - amber
6. 補正なし (5種類) - gray

**カラーテーマ**: グループごとにTailwindクラスで色分け

**Hook**: `useNatureSelector`

---

### CombinationRanking (src/components/CombinationRanking.tsx)

**役割**: ランキングテーブル表示

**表示内容**:
- 順位
- 性格（▲上昇 ▼下降 表示）
- サブスキル（1-3個、レベル付き）
- スコア（スキル/食材/きのみ）

**機能**:
- ユーザーの組み合わせをハイライト
- 仮想スクロール対応（大量データ用）
- タブで3種類のランキング切り替え

---

### IVAnalysisComponent (src/components/IVAnalysisComponent.tsx)

**役割**: ランク要約表示

**表示項目**:
- 現在のランク（例: "123位"）
- パーセンタイル（例: "上位15.2%"）
- 総組み合わせ数

---

### CalculatedPokemonInfo (src/components/CalculatedPokemonInfo.tsx)

**役割**: 計算結果の詳細表示

**表示項目**:
1. ポケモン名、図鑑番号、画像
2. 得意タイプ、メインスキル
3. 選択した性格（補正表示）
4. 選択したサブスキル（1-3個、レアリティ色分け）
5. 計算結果:
   - おてつだい時間
   - おてつだい回数/日
   - 食材確率、食材回数/日
   - スキル確率、スキル回数/日
   - きのみ回数/日、きのみエナジー/日

---

### HistoryList & HistoryItem

**役割**: 計算履歴の管理と表示

**HistoryList機能**:
- 最新50件まで保存（LocalStorage）
- 重複排除（同じポケモン+性格+サブスキルの組み合わせ）
- 削除・全クリア機能

**HistoryItem機能**:
- 展開/折りたたみ
- 計算結果プレビュー
- 復元機能（クリックで再設定）
- 削除機能

**Hook**: `useCalculationHistory`

**Storage**: `src/lib/storage/historyStorage.ts`

---

## ユーザーフロー

### 基本フロー

```
1. ポケモン選択
   ↓
2. [オプション] 性格選択
   ↓
3. [オプション] サブスキル選択（最大3個）
   ↓
4. 自動計算実行
   ↓
5. 結果表示
   - 計算結果カード
   - 3種類のランキングテーブル
   - ランク要約
   ↓
6. [オプション] 履歴に保存
   ↓
7. [オプション] 履歴から復元
```

### 自動計算トリガー

以下の変更時に自動で再計算:
- ポケモン変更
- 性格変更
- サブスキル追加・削除・並び替え

### データフロー

```
ユーザー操作
  ↓
React State更新 (useState)
  ↓
useEffect監視
  ↓
計算関数実行
  - calculatePokemonStatsSimple()
  - generateRankingData()
  ↓
State更新
  ↓
UIレンダリング
```

---

## 重要な実装の詳細

### 仮想スクロール (useVirtualScroll)

**目的**: 大量データ（1000+ポケモン、数千ランキングエントリ）の効率的な表示

**実装**:
```typescript
interface VirtualScrollConfig {
  totalItems: number;      // 総アイテム数
  itemHeight: number;      // 各アイテムの高さ（px）
  containerHeight: number; // コンテナの高さ（px）
  overscan?: number;       // 余分にレンダリングする数
}
```

**使用箇所**:
- ポケモン選択ドロップダウン
- ランキングテーブル

---

### LocalStorage管理 (historyStorage.ts)

**キー**: `"pokesleep-calculation-history"`

**最大保存件数**: 50件

**機能**:
- 自動タイムスタンプ付与
- 重複排除
- ポケモン番号自動復元（古いデータ対応）
- クォータ超過時の自動クリーンアップ

**データ構造**:
```typescript
interface CalculationHistoryItem {
  id: string;
  timestamp: number;
  pokemonName: string;
  pokemonInternalName: string;
  pokemonNumber: number;
  pokemonType: TokuiType;
  natureName: string | null;
  natureDisplay: string | null;
  subSkills: SelectedSubSkill[];
  calculationResult: CalculationResult;
}
```

---

### PokeAPI連携 (pokeApi.ts)

**目的**: ポケモン画像の取得

**エンドポイント**: `https://pokeapi.co/api/v2/pokemon/{number}`

**機能**:
- メモリキャッシュ（重複リクエスト防止）
- エラーハンドリング
- フォールバック（画像なしの場合null返却）

**使用箇所**: `CalculatedPokemonInfo.tsx`, `HistoryItem.tsx`

---

### かな変換 (kanaConverter.ts)

**目的**: カタカナ/ひらがなを区別しない検索

**関数**:
```typescript
katakanaToHiragana(str: string): string
hiraganaToKatakana(str: string): string
kanaInsensitiveMatch(a: string, b: string): boolean
kanaInsensitiveIncludes(text: string, search: string): boolean
```

**使用箇所**: `PokeNameCombobox.tsx`（ポケモン名検索）

---

### サブスキルユーティリティ (subSkillUtils.ts)

**バリアント設定**:
```typescript
const VARIANT_CONFIG = {
  skillTrigger: { variants: ["M", "S"], label: "スキル確率" },
  ingredientFinder: { variants: ["M", "S"], label: "食材確率" },
  skillLevelUp: { variants: ["M", "S"], label: "スキルレベル" },
  supportSpeed: { variants: ["M", "S"], label: "スピード" },
  inventoryCapacity: { variants: ["L", "M", "S"], label: "所持数" },
};
```

**レアリティスタイル取得**:
```typescript
getRarityStyles(rarity: Rarity): {
  gradient: string;  // Tailwindグラデーション
  border: string;    // ボーダー色
  badge: string;     // バッジ色
  text: string;      // テキスト色
}
```

---

### テーマシステム

**ライブラリ**: next-themes

**対応テーマ**:
- light
- dark

**カラーパレット**:
- 性格グループ別（6色: amber, green, red, purple, blue, gray）
- レアリティ別（3色: gold, blue, gray）

**実装**: `src/components/theme-provider.tsx`, `app/layout.tsx`

---

## テスト構成

### テストツール
- Vitest（ユニットテスト）
- React Testing Library（コンポーネントテスト）
- JSDOM（DOM環境シミュレーション）

### テストコマンド
```bash
npm run test          # ウォッチモード
npm run test:run      # 1回実行
npm run test:ui       # UIモードで実行
npm run test:coverage # カバレッジ計測
```

### 設定ファイル
- `vitest.config.ts`
- `src/test/setup.ts`

---

## ビルド・デプロイ

### コマンド
```bash
npm run dev      # 開発サーバー起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバー起動
npm run lint     # ESLint実行
```

### ビルド設定
- **Next.js設定**: `next.config.ts`
- **TypeScript設定**: `tsconfig.json` (strict mode)
- **Tailwind設定**: `postcss.config.mjs`

### デプロイ要件
- 静的サイト生成可能（SSG）
- サーバーレス不要（全データはクライアントサイド）

---

## コードの重要な位置

### 計算ロジック
- **コア計算**: `src/utils/pokemonCalculator.ts:336-403`
- **ランキング生成**: `src/utils/rankingGenerator.ts:126-251`

### データファイル
- **ポケモンデータ**: `src/data/pokemonData.ts` (2564行)
- **性格データ**: `src/data/natureData.ts:7-250`
- **サブスキルデータ**: `src/data/subSkillData.ts:3-106`

### UIコンポーネント
- **メインロジック**: `src/components/Search.tsx`
- **計算結果表示**: `src/components/CalculatedPokemonInfo.tsx`
- **ランキング表示**: `src/components/CombinationRanking.tsx`

### カスタムHooks
- **履歴管理**: `src/hooks/useCalculationHistory.ts`
- **性格選択**: `src/hooks/useNatureSelector.ts`
- **仮想スクロール**: `src/hooks/useVirtualScroll.ts`

---

## 注意事項・制約

### 計算の前提条件
- レベルは60固定（内部的にはパラメータ化されているが、UIでは変更不可）
- おやすみリボン補正は1.0固定
- 食材の種類・個数は考慮せず、食材回数のみを計算
- スキルの種類・レベルは考慮せず、スキル回数のみを計算

### パフォーマンス考慮事項
- ランキング生成は計算量が多い（25性格 × 数十〜数百組み合わせ × 3種類）
- 仮想スクロールで大量データの表示を最適化
- PokeAPI画像はメモリキャッシュで重複リクエストを防止

### ブラウザ要件
- LocalStorage利用（履歴保存）
- モダンブラウザ（ES2020+, Flexbox, Grid）

---

## 今後の拡張可能性

### 現在未実装だが拡張可能な要素
1. レベル可変対応（UI追加のみで実装可能）
2. おやすみリボン補正の切り替え
3. 食材の種類・個数の詳細計算
4. スキルレベルの考慮
5. 複数ポケモンの比較機能
6. ランキングのエクスポート（CSV等）
7. カスタムテーマ作成

---

## まとめ

この仕様書は、実際のコード実装を基に作成された正式な仕様書です。記載されている計算式、データ構造、コンポーネント構成は、すべて実装コードの内容を正確に反映しています。

計算ロジックの詳細は `src/utils/pokemonCalculator.ts` を、ランキング生成は `src/utils/rankingGenerator.ts` を参照してください。

UIコンポーネントの階層と役割は、この仕様書の「コンポーネント構造」セクションに詳述されています。

---

## 更新履歴

### v1.2.0 (2025-11-08)
- 仕様差異の記述を削除
- 実装コードが正式な仕様であることを明確化
- 「⚠️ 仕様差異」の注記をすべて削除
- 仕様書メンテナンスルールから仕様差異関連の項目を削除

### v1.1.0 (2025-11-08)
- 仕様書メンテナンスルールを追加
- コード変更時の仕様書更新ガイドラインを明記
- 更新フローとコミットメッセージのフォーマットを定義

### v1.0.0 (2025-11-08)
- 初版作成
- 全セクション完成（プロジェクト概要〜重要な実装の詳細）
- 実装コードベースの完全な仕様書化

---

**最終更新**: 2025-11-08
**現在のバージョン**: 1.2.0
**基準コミット**: 0780b5c
