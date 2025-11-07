"use client";

import React from "react";
import { SelectedNature } from "@/types/nature";
import { COLOR_CONFIG } from "@/data/natureData";
import { useNatureSelector } from "@/hooks/useNatureSelector";
import NatureBottomSheet from "./NatureBottomSheet";
import { Plus, X } from "lucide-react";

interface NatureSelectorProps {
  /** 選択済みの性格（親コンポーネントから制御する場合） */
  value?: SelectedNature | null;
  /** 性格変更時のコールバック */
  onChange?: (nature: SelectedNature | null) => void;
  /** カスタムクラス名 */
  className?: string;
}

/**
 * 性格選択UIのメインコンポーネント
 *
 * @example
 * ```tsx
 * <NatureSelector
 *   value={selectedNature}
 *   onChange={handleNatureChange}
 * />
 * ```
 */
export default function NatureSelector({
  value,
  onChange,
  className = "",
}: NatureSelectorProps) {
  const {
    selectedNature,
    showPicker,
    openPicker,
    closePicker,
    selectNature,
    clearNature,
  } = useNatureSelector({ value, onChange });

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base">性格</h2>
      </div>

      {/* 選択済み性格表示 / 選択ボタン */}
      {selectedNature ? (
        <div
          onClick={openPicker}
          className={`
            rounded-lg py-1.5 px-3 border-2 ${
              COLOR_CONFIG[selectedNature.color].border
            }
            cursor-pointer hover:shadow-md transition-all
            flex items-center justify-between
          `}
        >
          <span className="text-sm text-gray-800 dark:text-white">
            {selectedNature.name}
          </span>
          <div className="flex items-center gap-2">
            {selectedNature.up ? (
              <div className="flex flex-col gap-0 text-[10px] leading-tight">
                <span className="text-red-600 dark:text-red-300 font-medium">
                  ▲{selectedNature.up}
                </span>
                <span className="text-blue-600 dark:text-blue-300 font-medium">
                  ▼{selectedNature.down}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-gray-500 dark:text-gray-300">
                補正なし
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearNature();
              }}
              className="text-red-500 hover:text-red-700 transition-colors p-0.5 ml-1"
              aria-label="性格をクリア"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={openPicker}
          className="
            w-full py-1.5 px-3 rounded-lg border-2 border-dashed
            flex items-center justify-center gap-1.5
            text-sm font-medium transition-all
            border-secondary text-secondary bg-blue-50/30
            hover:bg-blue-50 hover:border-slate-400 active:scale-95
          "
        >
          <Plus className="w-4 h-4" />
          性格を選択
        </button>
      )}

      {/* ボトムシートモーダル */}
      <NatureBottomSheet
        isOpen={showPicker}
        selectedNature={selectedNature}
        onSelect={selectNature}
        onClose={closePicker}
      />
    </div>
  );
}
