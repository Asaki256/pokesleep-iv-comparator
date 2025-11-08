"use client";

import React from "react";
import { CalculationHistoryItem } from "@/types/calculationHistory";
import { Button } from "@/components/ui/button";
import { getRarityStyles } from "@/utils/subSkillUtils";
import { ChevronDown, ChevronUp, Trash2, CornerUpLeft } from "lucide-react";
import PokemonImage from "@/components/PokemonImage";

interface HistoryItemProps {
  item: CalculationHistoryItem;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onRestore: () => void;
}

const getTokuiStyle = (type: string | undefined) => {
  if (!type) return "bg-gray-400 text-white";

  switch (type) {
    case "きのみ":
      return "bg-green-500 text-white";
    case "スキル":
      return "bg-blue-500 text-white";
    case "食材":
      return "bg-orange-400 text-white";
    case "オール":
      return "bg-pink-400 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const diffDays = Math.floor(
    (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "今日";
  if (diffDays === 1) return "昨日";
  if (diffDays < 7) return `${diffDays}日前`;

  return date.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });
};

export default function HistoryItem({
  item,
  isExpanded,
  onToggle,
  onDelete,
  onRestore,
}: HistoryItemProps) {
  const displaySubSkills: (typeof item.subSkills[number] | null)[] = [...item.subSkills.slice(0, 3)];
  while (displaySubSkills.length < 3) {
    displaySubSkills.push(null);
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-card">
      {/* ヘッダー（常に表示） */}
      <div
        className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* ポケモン情報 */}
          <PokemonImage pokemonNumber={item.pokemonNumber} size={48} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-bold text-sm text-foreground">{item.pokemonName}</h4>
              {item.pokemonType && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getTokuiStyle(
                    item.pokemonType
                  )}`}
                >
                  {item.pokemonType}
                </span>
              )}
              <span className="text-[10px] text-muted-foreground">
                {formatDate(item.timestamp)}
              </span>
            </div>

            {/* コンパクト情報（折りたたみ時） */}
            {!isExpanded && (
              <div className="text-[10px] text-foreground space-y-0.5">
                <div className="flex items-center gap-1 flex-wrap">
                  <span>Lv.{item.level ?? 60}</span>
                  <span className="text-muted-foreground">|</span>
                  <span>サブスキル:</span>
                  {displaySubSkills.map((skill, index) => {
                    if (!skill) {
                      return (
                        <span
                          key={index}
                          className="inline-block px-1 py-0.5 rounded bg-muted text-muted-foreground text-[9px]"
                        >
                          未選択
                        </span>
                      );
                    }
                    const styles = getRarityStyles(skill.rarity);
                    return (
                      <span
                        key={index}
                        className={`inline-block px-1 py-0.5 rounded text-[9px] border ${styles.chip}`}
                      >
                        {skill.name}
                      </span>
                    );
                  })}
                </div>
                {item.natureDisplay && (
                  <div className="truncate">性格: <span className="font-semibold text-secondary">{item.natureDisplay}</span></div>
                )}
              </div>
            )}
          </div>

          {/* アクションボタン */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onRestore();
              }}
              className="h-8 px-2"
            >
              <CornerUpLeft className="h-4 w-4 mr-1" />
              <span className="text-[10px] hidden md:inline">反映</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="h-8 px-2 text-muted-foreground hover:text-foreground hover:bg-muted/50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* 詳細情報（展開時） */}
      {isExpanded && (
        <div className="border-t border-border p-3 bg-muted/30">
          {/* レベル、サブスキル、性格 */}
          <div className="mb-3 space-y-1">
            <div className="text-xs text-foreground">
              <span className="font-semibold">レベル:</span>{" "}
              <span className="font-semibold text-secondary">Lv.{item.level ?? 60}</span>
            </div>
            <div className="text-xs text-foreground">
              <span className="font-semibold">サブスキル:</span>{" "}
              {displaySubSkills.map((skill, index) => {
                if (!skill) {
                  return (
                    <span
                      key={index}
                      className="inline-block px-1.5 py-0.5 rounded mx-0.5 bg-muted text-muted-foreground border border-border text-[10px]"
                    >
                      未選択
                    </span>
                  );
                }
                const styles = getRarityStyles(skill.rarity);
                return (
                  <span
                    key={index}
                    className={`inline-block px-1.5 py-0.5 rounded mx-0.5 border text-[10px] ${styles.chip}`}
                  >
                    {skill.name}
                  </span>
                );
              })}
            </div>
            {item.natureDisplay && (
              <div className="text-xs text-foreground">
                <span className="font-semibold">性格:</span>{" "}
                <span className="font-semibold text-secondary">{item.natureDisplay}</span>
              </div>
            )}
          </div>

          {/* 計算結果テーブル */}
          <div className="bg-background rounded border border-border overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                    お手伝い時間
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                    食材
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                    スキル
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                    きのみ
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5 font-bold text-foreground whitespace-nowrap">
                    {Math.floor(item.calculationResult.calculatedSupportTime / 60)}
                    分
                    {item.calculationResult.calculatedSupportTime % 60}
                    秒
                  </td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    <div className="font-bold text-orange-600 dark:text-orange-400">
                      {item.calculationResult.foodHelpsPerDay.toFixed(1)}
                      回/日{" "}
                      <span className="text-foreground">
                        (
                        {(
                          item.calculationResult.calculatedFoodDropRate *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    <div className="font-bold text-purple-600 dark:text-purple-400">
                      {item.calculationResult.skillTriggersPerDay.toFixed(1)}
                      回/日{" "}
                      <span className="text-foreground">
                        (
                        {(
                          item.calculationResult.calculatedSkillRate *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-1.5 whitespace-nowrap">
                    <div className="flex flex-col gap-0.5">
                      <div className="font-bold text-green-600 dark:text-green-400">
                        {item.calculationResult.berryHelpsPerDay.toFixed(1)}
                        回/日{" "}
                        <span className="text-foreground">
                          (
                          {(
                            (1 - item.calculationResult.calculatedFoodDropRate) *
                            100
                          ).toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="font-bold text-blue-600 dark:text-blue-400">
                        {item.calculationResult.berryEnergyPerDay.toLocaleString()}
                        E/日
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
