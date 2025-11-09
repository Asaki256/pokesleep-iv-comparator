"use client";

import React, { useState } from "react";
import { CalculationHistoryItem } from "@/types/calculationHistory";
import HistoryItem from "./HistoryItem";
import { Button } from "@/components/ui/button";

interface HistoryListProps {
  /** 履歴一覧 */
  history: CalculationHistoryItem[];
  /** 履歴を削除 */
  deleteHistory: (id: string) => void;
  /** すべての履歴をクリア */
  clearHistory: () => void;
  /** ローディング状態 */
  isLoading: boolean;
  /** 履歴から復元時のコールバック */
  onRestore: (historyId: string) => void;
}

export default function HistoryList({
  history,
  deleteHistory,
  clearHistory,
  isLoading,
  onRestore,
}: HistoryListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // すべて展開/閉じる
  const toggleAll = () => {
    if (!history) return;

    if (isAllExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(history.map((item) => item.id)));
    }
    setIsAllExpanded(!isAllExpanded);
  };

  // 個別の展開/閉じる
  const toggleItem = (id: string) => {
    if (!history) return;

    const newSet = new Set(expandedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedIds(newSet);

    // すべて展開状態の同期
    setIsAllExpanded(newSet.size === history.length && history.length > 0);
  };

  // 削除（確認なし）
  const handleDelete = (id: string) => {
    deleteHistory(id);
  };

  // すべてクリア確認
  const handleClearAll = () => {
    if (
      confirm("すべての履歴を削除しますか？この操作は取り消せません。")
    ) {
      clearHistory();
      setExpandedIds(new Set());
      setIsAllExpanded(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">読み込み中...</div>;
  }

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-2">まだ履歴がありません</p>
        <p className="text-sm">決定ボタンを押すと自動的に保存されます</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* コントロールバー */}
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {history.length}件の履歴
          {history.length >= 50 && (
            <span className="ml-1 text-orange-600 dark:text-orange-400">(上限)</span>
          )}
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={toggleAll} className="h-7 text-xs px-2">
            {isAllExpanded ? "すべて閉じる" : "すべて展開"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearAll}
            className="text-muted-foreground hover:text-foreground h-7 text-xs px-2"
          >
            すべて削除
          </Button>
        </div>
      </div>

      {/* 履歴リスト */}
      <div className="space-y-1.5">
        {history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            isExpanded={expandedIds.has(item.id)}
            onToggle={() => toggleItem(item.id)}
            onDelete={() => handleDelete(item.id)}
            onRestore={() => onRestore(item.id)}
          />
        ))}
      </div>

      <div className="text-center text-[10px] text-muted-foreground mt-2">
        履歴は最大50件まで保存されます
      </div>
    </div>
  );
}
