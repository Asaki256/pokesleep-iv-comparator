"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LevelSelectorProps {
  value: number;
  onChange: (level: number) => void;
}

const LEVEL_PRESETS = [10, 25, 30, 50, 60];

/**
 * レベルによって適用されるサブスキルの数を返す
 */
const getApplicableSubSkillCount = (level: number): number => {
  if (level < 10) return 0;
  if (level < 25) return 1;
  if (level < 50) return 2;
  return 3;
};

/**
 * レベル選択コンポーネント
 * - プリセットボタン（10, 25, 30, 50, 60）と手動入力を提供
 * - 選択されたレベルに応じてサブスキル適用数を表示
 */
export default function LevelSelector({ value, onChange }: LevelSelectorProps) {
  const [inputValue, setInputValue] = useState(value.toString());

  const handlePresetClick = (level: number) => {
    onChange(level);
    setInputValue(level.toString());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    const numValue = parseInt(newValue, 10);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue, 10);
    if (isNaN(numValue) || numValue < 1 || numValue > 100) {
      setInputValue(value.toString());
    }
  };

  const applicableSubSkillCount = getApplicableSubSkillCount(value);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">レベル</h2>
      </div>

      {/* プリセットボタン */}
      <div className="flex gap-2 mb-3">
        {LEVEL_PRESETS.map((level) => (
          <Button
            key={level}
            variant="outline"
            size="sm"
            onClick={() => handlePresetClick(level)}
            className="flex-1 h-9 text-sm"
          >
            {level}
          </Button>
        ))}
      </div>

      {/* 説明テキストと手動入力 */}
      <div className="flex items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          Lv.{value}までのサブスキルが適用されます
          {applicableSubSkillCount > 0 && ` (${applicableSubSkillCount}個)`}
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="level-input" className="text-xs text-muted-foreground whitespace-nowrap">
            Lv.
          </label>
          <input
            id="level-input"
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-16 h-9 px-2 text-sm border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
