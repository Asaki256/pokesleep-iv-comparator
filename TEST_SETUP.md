# テスト環境セットアップ

このプロジェクトでは**Vitest + React Testing Library**を使用したユニットテストを実装しています。

## セットアップ済みツール

- **Vitest**: 高速なテストランナー
- **@vitejs/plugin-react**: React コンポーネントのサポート
- **@testing-library/react**: React コンポーネントのテスト
- **@testing-library/jest-dom**: DOM マッチャー
- **@testing-library/user-event**: ユーザーインタラクションのシミュレーション
- **jsdom**: DOM 環境のシミュレーション

## テストコマンド

```bash
# テストをwatchモードで実行（開発時）
npm test

# テストを1回だけ実行（CI用）
npm run test:run

# カバレッジレポート付きでテスト実行
npm run test:coverage

# UIモードでテスト実行
npm run test:ui
```

## フォルダ構成

テストファイルは**コロケーションパターン**で配置されています。
つまり、テストファイルはテスト対象ファイルと同じディレクトリに配置されます。

```
src/
├── components/
│   ├── Search.tsx
│   ├── Search.test.tsx          # Searchのテスト
│   └── SubSkillSelect/
│       ├── SkillCard.tsx
│       ├── SkillCard.test.tsx   # SkillCardのテスト
│       └── ...
├── utils/
│   ├── subSkillUtils.ts
│   └── subSkillUtils.test.ts    # utilsのテスト
└── test/
    └── setup.ts                 # テストセットアップファイル
```

## テストファイルの命名規則

- **コンポーネント**: `ComponentName.test.tsx`
- **ユーティリティ**: `utilityName.test.ts`
- **hooks**: `useHookName.test.ts`

## サンプルテスト

### ユーティリティ関数のテスト例

```typescript
// src/utils/subSkillUtils.test.ts
import { describe, it, expect } from 'vitest'
import { getAutoLevel } from './subSkillUtils'

describe('subSkillUtils', () => {
  describe('getAutoLevel', () => {
    it('インデックス0に対して10を返す', () => {
      expect(getAutoLevel(0)).toBe(10)
    })
  })
})
```

### Reactコンポーネントのテスト例

```typescript
// src/components/SubSkillSelect/SkillCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkillCard } from './SkillCard'

describe('SkillCard', () => {
  const mockOnEdit = vi.fn()
  const mockOnRemove = vi.fn()

  it('スキル情報が正しく表示される', () => {
    const mockSkill = {
      id: 'test-1',
      baseId: 'skillLevelUpM',
      name: 'スキルレベルアップM',
      variant: 'M',
      level: 10,
      rarity: 'gold',
    }

    render(
      <SkillCard
        skill={mockSkill}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    )

    expect(screen.getByText('Lv.10')).toBeInTheDocument()
    expect(screen.getByText('スキルレベルアップM')).toBeInTheDocument()
  })

  it('削除ボタンをクリックすると削除ハンドラーが呼ばれる', async () => {
    const user = userEvent.setup()

    render(
      <SkillCard
        skill={mockSkill}
        onEdit={mockOnEdit}
        onRemove={mockOnRemove}
      />
    )

    const deleteButton = screen.getByLabelText('削除')
    await user.click(deleteButton)

    expect(mockOnRemove).toHaveBeenCalledTimes(1)
  })
})
```

## よく使うマッチャー

### DOM要素の検証
- `expect(element).toBeInTheDocument()` - 要素が存在するか
- `expect(element).toHaveTextContent('text')` - テキストコンテンツを持つか
- `expect(element).toHaveClass('className')` - クラスを持つか
- `expect(element).toBeVisible()` - 表示されているか
- `expect(element).toBeDisabled()` - 無効化されているか

### 関数・値の検証
- `expect(fn).toHaveBeenCalled()` - 関数が呼ばれたか
- `expect(fn).toHaveBeenCalledTimes(n)` - n回呼ばれたか
- `expect(fn).toHaveBeenCalledWith(arg)` - 特定の引数で呼ばれたか
- `expect(value).toBe(expected)` - 厳密等価
- `expect(value).toEqual(expected)` - オブジェクト・配列の等価

## テストのベストプラクティス

1. **AAA パターンに従う**
   - Arrange (準備)
   - Act (実行)
   - Assert (検証)

2. **ユーザーの視点でテストする**
   - `getByText`, `getByRole` などユーザーが見るものでクエリ
   - 実装の詳細（クラス名、内部state）に依存しない

3. **テストは独立させる**
   - 各テストは他のテストに依存しない
   - `beforeEach`でモックをクリア

4. **意味のあるテスト名**
   - 何をテストしているか明確に
   - 日本語でもOK

## カバレッジ

カバレッジレポートは `npm run test:coverage` で生成されます。
レポートは `coverage/` ディレクトリに出力されます（gitignore済み）。

## CI/CD統合

GitHub Actions などで以下のコマンドを実行：

```yaml
- name: Run tests
  run: npm run test:run

- name: Generate coverage
  run: npm run test:coverage
```

## トラブルシューティング

### テストが遅い
- `test.pool` を `'threads'` から `'forks'` に変更
- 不要なテストファイルを除外

### import エラー
- `vitest.config.ts` の `resolve.alias` を確認
- パスエイリアス (`@/`) が正しく設定されているか確認

### モックが効かない
- `vi.fn()` を使用
- `beforeEach` でモックをクリア

## 参考リンク

- [Vitest 公式ドキュメント](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library クエリ優先順位](https://testing-library.com/docs/queries/about/#priority)
