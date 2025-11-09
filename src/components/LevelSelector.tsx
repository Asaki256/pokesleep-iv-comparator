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
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-semibold text-foreground">レベル</h2>
      </div>

      {/* クイック選択ボタンと手動入力を1行に */}
      <div className="flex items-center gap-2 flex-wrap">
        {QUICK_LEVELS.map((quickLevel) => (
          <button
            key={quickLevel}
            onClick={() => handleQuickSelect(quickLevel)}
            className={`
              px-3 py-1 rounded text-xs font-medium transition-all
              ${
                level === quickLevel
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/20 hover:bg-secondary/30 text-foreground border border-border"
              }
            `}
          >
            Lv.{quickLevel}
          </button>
        ))}
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-xs text-muted-foreground">Lv.</span>
          <input
            type="number"
            min="1"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-16 h-7 rounded border border-border bg-background px-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
      </div>

      {/* サブスキル適用状態の表示 */}
      <div className="mt-2 px-2 py-1 bg-muted/50 rounded text-[10px] text-muted-foreground">
        {level < 10 && "サブスキルなし"}
        {level >= 10 && level < 25 && "サブスキル1つ目まで適用"}
        {level >= 25 && level < 50 && "サブスキル2つ目まで適用"}
        {level >= 50 && "サブスキル3つ目まで適用"}
      </div>
    </div>
  );
};

export default LevelSelector;
