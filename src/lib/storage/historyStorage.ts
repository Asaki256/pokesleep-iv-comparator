import { CalculationHistoryItem } from "@/types/calculationHistory";
import { pokemonData } from "@/data/pokemonData";

const STORAGE_KEY = "pokesleep-calculation-history";
const MAX_HISTORY_COUNT = 50;

/**
 * 履歴ストレージのCRUD操作
 */
export const historyStorage = {
  /**
   * すべての履歴を取得（新しい順）
   */
  getAll(): CalculationHistoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];

      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];

      // バリデーションと日付順ソート
      const validated = parsed
        .filter(isValidHistoryItem)
        .map((item) => {
          // pokemonNumberがない場合は、pokemonInternalNameから復元
          if (item.pokemonNumber === undefined) {
            const pokemon = pokemonData.find(
              (p) => p.name === item.pokemonInternalName
            );
            if (pokemon) {
              return {
                ...item,
                pokemonNumber: pokemon.number,
              };
            }
          }
          return item;
        });
      return validated.sort(
        (a, b) => b.timestamp - a.timestamp
      );
    } catch (error) {
      console.error("履歴の読み込みに失敗しました:", error);
      return [];
    }
  },

  /**
   * IDで履歴を取得
   */
  getById(id: string): CalculationHistoryItem | null {
    const all = this.getAll();
    return all.find((item) => item.id === id) ?? null;
  },

  /**
   * 履歴を保存
   * @param item 保存する履歴（idとtimestampは自動生成）
   * @returns 保存された履歴（idとtimestamp付き）
   */
  save(
    item: Omit<CalculationHistoryItem, "id" | "timestamp">
  ): CalculationHistoryItem {
    const newItem: CalculationHistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    try {
      let history = this.getAll();

      // 重複チェック
      const isDuplicate = this.isDuplicate(
        newItem,
        history
      );
      if (isDuplicate) {
        console.info(
          "重複する履歴のため、既存の履歴を更新します"
        );
        // 既存の同一履歴を削除
        history = history.filter(
          (h) => !this.isSameItem(h, newItem)
        );
      }

      // 新しい履歴を先頭に追加
      history.unshift(newItem);

      // 最大件数を超えたら古いものを削除
      if (history.length > MAX_HISTORY_COUNT) {
        history = history.slice(0, MAX_HISTORY_COUNT);
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );
      return newItem;
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "QuotaExceededError"
      ) {
        console.warn(
          "ローカルストレージの容量が不足しています。古い履歴を削除します。"
        );
        // 古い履歴を削除して再試行
        const history = this.getAll().slice(
          0,
          Math.floor(MAX_HISTORY_COUNT / 2)
        );
        history.unshift(newItem);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(history)
        );
        return newItem;
      }
      throw error;
    }
  },

  /**
   * 履歴を削除
   */
  delete(id: string): boolean {
    try {
      const history = this.getAll().filter(
        (item) => item.id !== id
      );
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );
      return true;
    } catch (error) {
      console.error("履歴の削除に失敗しました:", error);
      return false;
    }
  },

  /**
   * すべての履歴をクリア
   */
  clear(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("履歴のクリアに失敗しました:", error);
      return false;
    }
  },

  /**
   * 重複チェック
   */
  isDuplicate(
    newItem: CalculationHistoryItem,
    existingHistory: CalculationHistoryItem[]
  ): boolean {
    return existingHistory.some((item) =>
      this.isSameItem(item, newItem)
    );
  },

  /**
   * 2つの履歴が同一かチェック
   */
  isSameItem(
    item1: CalculationHistoryItem,
    item2: CalculationHistoryItem
  ): boolean {
    // ポケモン名が異なる
    if (
      item1.pokemonInternalName !==
      item2.pokemonInternalName
    )
      return false;

    // 性格が異なる
    if (item1.natureName !== item2.natureName) return false;

    // サブスキルの数が異なる
    if (item1.subSkills.length !== item2.subSkills.length)
      return false;

    // サブスキルのIDをソートして比較
    const skills1 = item1.subSkills.map((s) => s.id).sort();
    const skills2 = item2.subSkills.map((s) => s.id).sort();

    return skills1.every(
      (id, index) => id === skills2[index]
    );
  },
};

/**
 * 履歴アイテムのバリデーション
 */
function isValidHistoryItem(
  item: unknown
): item is CalculationHistoryItem {
  if (!item || typeof item !== "object") return false;

  const obj = item as Record<string, unknown>;

  return (
    typeof obj.id === "string" &&
    typeof obj.timestamp === "number" &&
    typeof obj.pokemonName === "string" &&
    typeof obj.pokemonInternalName === "string" &&
    Array.isArray(obj.subSkills) &&
    typeof obj.calculationResult === "object"
  );
}
