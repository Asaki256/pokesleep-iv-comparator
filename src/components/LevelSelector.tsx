"use client";

import { useState, useEffect } from "react";

interface LevelSelectorProps {
  value?: number;
  onChange?: (level: number) => void;
}

const QUICK_LEVELS = [10, 25, 30, 50, 60];

const LevelSelector = ({ value = 60, onChange }: LevelSelectorProps) => {
  const [level, setLevel] = useState<number>(value);
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // 外部からのvalue変更を反映
  useEffect(() => {
    setLevel(value);
    setInputValue(value.toString());
  }, [value]);

  // レベル変更ハンドラー
  const handleLevelChange = (newLevel: number) => {
    // 1-100の範囲内に制限
    const validLevel = Math.max(1, Math.min(100, newLevel));
    setLevel(validLevel);
    setInputValue(validLevel.toString());
    onChange?.(validLevel);
  };

  // クイック選択ボタンのハンドラー
  const handleQuickSelect = (selectedLevel: number) => {
    handleLevelChange(selectedLevel);
  };

  // 手動入力のハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // 数値に変換できる場合のみレベルを更新
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      handleLevelChange(numValue);
    }
  };

  // フォーカスが外れた時の処理（空欄の場合はデフォルト値に戻す）
  const handleInputBlur = () => {
    if (inputValue === "" || isNaN(parseInt(inputValue, 10))) {
      setInputValue(level.toString());
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">レベル</h2>
      </div>

      {/* クイック選択ボタン */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {QUICK_LEVELS.map((quickLevel) => (
          <button
            key={quickLevel}
            onClick={() => handleQuickSelect(quickLevel)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                level === quickLevel
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary/20 hover:bg-secondary/30 text-foreground border border-border"
              }
            `}
          >
            Lv.{quickLevel}
          </button>
        ))}
      </div>

      {/* 手動入力 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-foreground whitespace-nowrap">
          手動入力:
        </label>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm text-muted-foreground">Lv.</span>
          <input
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="flex-1 max-w-[100px] h-10 rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <span className="text-xs text-muted-foreground">(1-100)</span>
        </div>
      </div>

      {/* サブスキル適用状態の表示 */}
      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground mb-1">
          <span className="font-semibold text-foreground">
            サブスキル適用状態:
          </span>
        </p>
        <p className="text-xs text-foreground">
          {level < 10 && "サブスキルなし"}
          {level >= 10 && level < 25 && "サブスキル1つ目まで適用"}
          {level >= 25 && level < 50 && "サブスキル2つ目まで適用"}
          {level >= 50 && "サブスキル3つ目まで適用"}
        </p>
      </div>
    </div>
  );
};

export default LevelSelector;
