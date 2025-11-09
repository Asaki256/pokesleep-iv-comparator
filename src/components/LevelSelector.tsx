"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LevelSelectorProps {
  /** 選択されたレベル */
  value: number;
  /** レベル変更時のコールバック */
  onChange: (level: number) => void;
  /** カスタムクラス名 */
  className?: string;
}

const QUICK_SELECT_LEVELS = [10, 25, 30, 50, 60];

/**
 * レベル選択UIコンポーネント
 * クイック選択ボタンと手動入力の両方をサポート
 */
export default function LevelSelector({
  value,
  onChange,
  className = "",
}: LevelSelectorProps) {
  const [inputValue, setInputValue] = React.useState(value.toString());

  // value が外部から変更された場合、inputValue も同期
  React.useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleQuickSelect = (level: number) => {
    onChange(level);
    setInputValue(level.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // 数値に変換して検証
    const numValue = parseInt(val, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    // ブラー時に値を検証して修正
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < 1) {
      onChange(1);
      setInputValue("1");
    } else if (numValue > 100) {
      onChange(100);
      setInputValue("100");
    } else {
      setInputValue(numValue.toString());
    }
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base">レベル</h2>
      </div>

      {/* クイック選択ボタン */}
      <div className="flex gap-2 mb-3 justify-center flex-wrap">
        {QUICK_SELECT_LEVELS.map((level) => (
          <Button
            key={level}
            variant={value === level ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickSelect(level)}
            className={`
              px-4 py-1.5 text-sm font-medium transition-all
              ${value === level ? "ring-2 ring-offset-2 ring-primary" : ""}
            `}
          >
            Lv.{level}
          </Button>
        ))}
      </div>

      {/* 手動入力 */}
      <div className="flex items-center gap-2">
        <label htmlFor="level-input" className="text-sm text-muted-foreground whitespace-nowrap">
          手動入力:
        </label>
        <Input
          id="level-input"
          type="number"
          min="1"
          max="100"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          className="text-center font-medium"
          placeholder="1-100"
        />
      </div>

      {/* 補足説明 */}
      <div className="mt-2 text-xs text-muted-foreground text-center">
        レベル1〜100を選択できます
      </div>
    </div>
  );
}
