'use client';

import { useState, useCallback } from 'react';
import { SelectedNature } from '@/types/nature';
import { getDefaultNature } from '@/data/natureData';

interface UseNatureSelectorProps {
  /** 親コンポーネントから渡される選択済み性格 */
  value?: SelectedNature | null;
  /** 性格変更時のコールバック */
  onChange?: (nature: SelectedNature | null) => void;
}

interface UseNatureSelectorReturn {
  /** 選択済みの性格 */
  selectedNature: SelectedNature | null;
  /** ボトムシートの表示状態 */
  showPicker: boolean;
  /** ボトムシートを開く */
  openPicker: () => void;
  /** ボトムシートを閉じる */
  closePicker: () => void;
  /** 性格を選択 */
  selectNature: (nature: SelectedNature) => void;
  /** 性格をクリア */
  clearNature: () => void;
}

/**
 * 性格選択UIの状態管理カスタムフック
 *
 * 制御コンポーネント（value/onChangeを渡す）と
 * 非制御コンポーネント（内部状態管理）の両方に対応
 */
export function useNatureSelector({
  value,
  onChange,
}: UseNatureSelectorProps = {}): UseNatureSelectorReturn {
  // 内部状態（非制御時のみ使用）
  const [internalNature, setInternalNature] = useState<SelectedNature | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // 制御 or 非制御の判定
  const isControlled = value !== undefined;
  const selectedNature = isControlled ? value : internalNature;

  /**
   * ボトムシートを開く
   */
  const openPicker = useCallback(() => {
    setShowPicker(true);
  }, []);

  /**
   * ボトムシートを閉じる
   */
  const closePicker = useCallback(() => {
    setShowPicker(false);
  }, []);

  /**
   * 性格を選択
   */
  const selectNature = useCallback(
    (nature: SelectedNature) => {
      if (isControlled) {
        onChange?.(nature);
      } else {
        setInternalNature(nature);
      }
      closePicker();
    },
    [isControlled, onChange, closePicker]
  );

  /**
   * 性格をクリア（デフォルト性格に戻す）
   */
  const clearNature = useCallback(() => {
    const defaultNature = getDefaultNature() as SelectedNature;
    if (isControlled) {
      onChange?.(defaultNature);
    } else {
      setInternalNature(defaultNature);
    }
  }, [isControlled, onChange]);

  return {
    selectedNature,
    showPicker,
    openPicker,
    closePicker,
    selectNature,
    clearNature,
  };
}
