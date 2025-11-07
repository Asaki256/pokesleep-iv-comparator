"use client";

import React from "react";
import { CalculationResult } from "@/utils/pokemonCalculator";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { getRarityStyles } from "@/utils/subSkillUtils";
import PokemonImage from "@/components/PokemonImage";

// 型定義
interface CalculatedPokemonInfoProps {
  pokemonName: string;
  pokemonNumber?: number;
  pokemonType?: string;
  nature?: string;
  subSkills: SelectedSubSkill[];
  calculationResult: CalculationResult;
}

// 日付フォーマット関数
const formatDate = (date: Date) => {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (today.getTime() === targetDate.getTime()) {
    return "今日";
  }

  return date.toLocaleDateString("ja-JP", {
    month: "numeric",
    day: "numeric",
  });
};

const getTokuiStyle = (type: string) => {
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

const CalculatedPokemonInfo: React.FC<
  CalculatedPokemonInfoProps
> = ({
  pokemonName,
  pokemonNumber,
  pokemonType,
  nature,
  subSkills,
  calculationResult,
}) => {
  // サブスキルを最大3つまで表示用に整形
  const displaySubSkills = [...subSkills.slice(0, 3)];
  while (displaySubSkills.length < 3) {
    displaySubSkills.push(null as any);
  }

  // 現在の日時を取得
  const currentDate = new Date();

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
      {/* ヘッダー */}
      <div className="p-3 md:p-4 border-b border-border">
        {/* 1行目: ポケモン画像・名前・バッジ・日付 */}
        <div className="flex items-center gap-2 md:gap-3 mb-2">
          <PokemonImage pokemonNumber={pokemonNumber} size={48} />
          <h4 className="font-bold text-sm md:text-base text-foreground">
            {pokemonName}
          </h4>
          {pokemonType && (
            <span
              className={`text-[9px] md:text-[10px] px-3 py-1 rounded-full font-bold ${getTokuiStyle(
                pokemonType
              )}`}
            >
              {pokemonType}
            </span>
          )}
          <div className="flex-1"></div>
          <span className="text-[9px] md:text-[10px] text-muted-foreground font-medium">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* 2-3行目グループ: サブスキルと性格 */}
        <div className="ml-8 md:ml-12 space-y-1">
          <div className="text-[10px] md:text-xs text-foreground">
            <span className="font-semibold">
              サブスキル:
            </span>{" "}
            {displaySubSkills.map((skill, index) => {
              if (!skill) {
                return (
                  <span
                    key={index}
                    className="inline-block px-1.5 py-0.5 rounded mx-0.5 bg-muted text-muted-foreground border border-border"
                  >
                    未選択
                  </span>
                );
              }
              const styles = getRarityStyles(skill.rarity);
              return (
                <span
                  key={index}
                  className={`inline-block px-1.5 py-0.5 rounded mx-0.5 border ${styles.chip}`}
                >
                  {skill.name}
                </span>
              );
            })}
          </div>
          {nature && (
            <div className="text-[10px] md:text-xs text-foreground">
              <span className="font-semibold">性格:</span>{" "}
              <span className="font-semibold text-secondary">{nature}</span>
            </div>
          )}
        </div>
      </div>

      {/* 計算結果 */}
      <div className="p-3 md:p-4 bg-muted/30">
        <div className="bg-background rounded-lg border border-border overflow-x-auto shadow-sm">
          <table className="w-full text-[10px] md:text-xs">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-2 md:px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  お手伝い時間
                </th>
                <th className="px-2 md:px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  食材
                </th>
                <th className="px-2 md:px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  スキル
                </th>
                <th className="px-2 md:px-3 py-1.5 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  きのみ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 md:px-3 py-1.5 font-bold text-foreground whitespace-nowrap">
                  {(calculationResult.calculatedSupportTime / 60).toFixed(1)}
                  分
                </td>
                <td className="px-2 md:px-3 py-1.5 whitespace-nowrap">
                  <div className="font-bold text-orange-600 dark:text-orange-400">
                    {calculationResult.foodHelpsPerDay.toFixed(1)}
                    回/日{" "}
                    <span className="text-foreground">
                      (
                      {(
                        calculationResult.calculatedFoodDropRate *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </td>
                <td className="px-2 md:px-3 py-1.5 whitespace-nowrap">
                  <div className="font-bold text-purple-600 dark:text-purple-400">
                    {calculationResult.skillTriggersPerDay.toFixed(1)}
                    回/日{" "}
                    <span className="text-foreground">
                      (
                      {(
                        calculationResult.calculatedSkillRate *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </div>
                </td>
                <td className="px-2 md:px-3 py-1.5 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {calculationResult.berryHelpsPerDay.toFixed(1)}
                      回/日{" "}
                      <span className="text-foreground">
                        (
                        {(
                          (1 - calculationResult.calculatedFoodDropRate) *
                          100
                        ).toFixed(1)}
                        %)
                      </span>
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400">
                      {calculationResult.berryEnergyPerDay.toLocaleString()}
                      E/日
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CalculatedPokemonInfo;
