'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { SelectedNature } from '@/types/nature';
import { NATURE_GROUPS } from '@/data/natureData';
import NatureGroup from './NatureGroup';
import { X, Search } from 'lucide-react';

interface NatureBottomSheetProps {
  isOpen: boolean;
  selectedNature: SelectedNature | null;
  onSelect: (nature: SelectedNature) => void;
  onClose: () => void;
}

export default function NatureBottomSheet({
  isOpen,
  selectedNature,
  onSelect,
  onClose,
}: NatureBottomSheetProps) {
  // 入力中の検索クエリ（ユーザーが入力している値）
  const [inputValue, setInputValue] = useState('');
  // 実際に検索に使用するクエリ（デバウンス後の値）
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // モーダルが開いたときにbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // queueMicrotaskを使用して状態更新を次のイベントループに遅延
      queueMicrotask(() => {
        setInputValue(''); // モーダルを開く際に入力値をリセット
        setDebouncedQuery(''); // 検索クエリもリセット
      });
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // デバウンス処理：入力が止まってから300ms後に検索クエリを更新
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue]);

  // 検索クエリに基づいて性格グループをフィルタリング
  const filteredGroups = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return NATURE_GROUPS;
    }

    const query = debouncedQuery.toLowerCase().trim();

    return NATURE_GROUPS.map((group) => {
      const filteredNatures = group.natures.filter((nature) =>
        nature.name.toLowerCase().includes(query)
      );

      return {
        ...group,
        natures: filteredNatures,
      };
    }).filter((group) => group.natures.length > 0); // 性格が0個のグループは表示しない
  }, [debouncedQuery]);

  // 検索結果が空かどうか
  const hasNoResults = filteredGroups.length === 0 && debouncedQuery.trim() !== '';

  if (!isOpen) return null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="bg-card rounded-t-3xl max-h-[80vh] overflow-y-auto shadow-2xl">
          {/* ハンドル */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-border rounded-full" />
          </div>

          {/* ヘッダー */}
          <div className="px-4 pb-2 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">性格を選択</h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-muted transition-colors cursor-pointer"
                aria-label="閉じる"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* 選択中の性格を表示 */}
            {selectedNature && (
              <div className="mt-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/30">
                  <span className="text-xs text-secondary">選択中</span>
                  <span className="text-xs font-semibold text-secondary">
                    {selectedNature.name}
                  </span>
                  {selectedNature.up && (
                    <span className="text-[10px] text-foreground">
                      (▲{selectedNature.up} ▼{selectedNature.down})
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 検索フィールド */}
            <div className="mt-2 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="性格名で検索..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-background text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                {inputValue && (
                  <button
                    onClick={() => setInputValue('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    aria-label="検索をクリア"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* コンテンツ */}
          <div className="px-4 py-3">
            {hasNoResults ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="w-12 h-12 text-muted mb-3" />
                <p className="text-sm text-muted-foreground font-medium">
                  「{debouncedQuery}」に一致する性格が見つかりませんでした
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  別のキーワードで検索してください
                </p>
              </div>
            ) : (
              <div className="space-y-3 pb-3">
                {filteredGroups.map((group) => (
                  <NatureGroup
                    key={group.id}
                    group={group}
                    selectedNature={selectedNature}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
