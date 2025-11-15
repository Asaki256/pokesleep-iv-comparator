import { useState, useEffect, useCallback } from "react";
import { CalculationHistoryItem } from "@/types/calculationHistory";
import { historyStorage } from "@/lib/storage/historyStorage";

interface UseCalculationHistoryReturn {
  /** 履歴一覧（新しい順） */
  history: CalculationHistoryItem[];

  /** 履歴を追加 */
  addHistory: (
    item: Omit<CalculationHistoryItem, "id" | "timestamp">,
  ) => CalculationHistoryItem;

  /** 指定IDの履歴を削除 */
  deleteHistory: (id: string) => void;

  /** すべての履歴をクリア */
  clearHistory: () => void;

  /** IDで履歴を取得 */
  getHistoryById: (id: string) => CalculationHistoryItem | null;

  /** ローディング状態 */
  isLoading: boolean;
}

export function useCalculationHistory(): UseCalculationHistoryReturn {
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初回マウント時にlocalStorageから読み込み
  useEffect(() => {
    try {
      const loaded = historyStorage.getAll();
      setHistory(loaded);
    } catch (error) {
      console.error("履歴の読み込みに失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 履歴を追加
  const addHistory = useCallback(
    (item: Omit<CalculationHistoryItem, "id" | "timestamp">) => {
      try {
        const newItem = historyStorage.save(item);
        setHistory(historyStorage.getAll());
        return newItem;
      } catch (error) {
        console.error("履歴の保存に失敗しました:", error);
        throw error;
      }
    },
    [],
  );

  // 履歴を削除
  const deleteHistory = useCallback((id: string) => {
    try {
      historyStorage.delete(id);
      setHistory(historyStorage.getAll());
    } catch (error) {
      console.error("履歴の削除に失敗しました:", error);
    }
  }, []);

  // すべてクリア
  const clearHistory = useCallback(() => {
    try {
      historyStorage.clear();
      setHistory([]);
    } catch (error) {
      console.error("履歴のクリアに失敗しました:", error);
    }
  }, []);

  // IDで取得
  const getHistoryById = useCallback((id: string) => {
    return historyStorage.getById(id);
  }, []);

  return {
    history,
    addHistory,
    deleteHistory,
    clearHistory,
    getHistoryById,
    isLoading,
  };
}
