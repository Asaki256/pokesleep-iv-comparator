"use client";

import React from "react";
import { CalculationHistoryItem } from "@/types/calculationHistory";
import { Button } from "@/components/ui/button";
import { getRarityStyles } from "@/utils/subSkillUtils";
import { ChevronDown, ChevronUp, Trash2, CornerUpLeft } from "lucide-react";

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
  const displaySubSkills = [...item.subSkills.slice(0, 3)];
  while (displaySubSkills.length < 3) {
    displaySubSkills.push(null as any);
  }

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* ヘッダー（常に表示） */}
      <div
        className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {/* ポケモン情報 */}
          <div className="text-xl">🎮</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-bold text-sm">{item.pokemonName}</h4>
              {item.pokemonType && (
                <span
                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getTokuiStyle(
                    item.pokemonType
                  )}`}
                >
                  {item.pokemonType}
                </span>
              )}
              <span className="text-[10px] text-gray-500">
                {formatDate(item.timestamp)}
              </span>
            </div>

            {/* コンパクト情報（折りたたみ時） */}
            {!isExpanded && (
              <div className="text-[10px] text-gray-600 space-y-0.5">
                {item.natureDisplay && (
                  <div className="truncate">性格: {item.natureDisplay}</div>
                )}
                <div className="flex items-center gap-1 flex-wrap">
                  <span>サブスキル:</span>
                  {displaySubSkills.map((skill, index) => {
                    if (!skill) {
                      return (
                        <span
                          key={index}
                          className="inline-block px-1 py-0.5 rounded bg-gray-100 text-gray-400 text-[9px]"
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
              className="h-8 px-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      {/* 詳細情報（展開時） */}
      {isExpanded && (
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          {/* 性格とサブスキル */}
          <div className="mb-3 space-y-1">
            {item.natureDisplay && (
              <div className="text-xs text-gray-700">
                <span className="font-semibold">性格:</span>{" "}
                {item.natureDisplay}
              </div>
            )}
            <div className="text-xs text-gray-700">
              <span className="font-semibold">サブスキル:</span>{" "}
              {displaySubSkills.map((skill, index) => {
                if (!skill) {
                  return (
                    <span
                      key={index}
                      className="inline-block px-1.5 py-0.5 rounded mx-0.5 bg-gray-100 text-gray-400 border border-gray-200 text-[10px]"
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
          </div>

          {/* 計算結果テーブル */}
          <div className="bg-white rounded border border-gray-200 overflow-x-auto">
            <table className="w-full text-[10px]">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    お手伝い時間
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    食材確率
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    食材/日
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    スキル確率
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    スキル/日
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    きのみ/日
                  </th>
                  <th className="px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                    きのみE/日
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                    {item.calculationResult.calculatedSupportTime.toLocaleString()}
                    秒
                  </td>
                  <td className="px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                    {(
                      item.calculationResult.calculatedFoodDropRate * 100
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="px-2 py-1.5 font-bold text-orange-600 whitespace-nowrap">
                    {item.calculationResult.foodHelpsPerDay.toFixed(1)}回
                  </td>
                  <td className="px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                    {(
                      item.calculationResult.calculatedSkillRate * 100
                    ).toFixed(1)}
                    %
                  </td>
                  <td className="px-2 py-1.5 font-bold text-purple-600 whitespace-nowrap">
                    {item.calculationResult.skillTriggersPerDay.toFixed(1)}回
                  </td>
                  <td className="px-2 py-1.5 font-bold text-green-600 whitespace-nowrap">
                    {item.calculationResult.berryHelpsPerDay.toFixed(1)}回
                  </td>
                  <td className="px-2 py-1.5 font-bold text-blue-600 whitespace-nowrap">
                    {item.calculationResult.berryEnergyPerDay.toLocaleString()}
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
