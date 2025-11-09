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
  level: number;
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
  level,
  subSkills,
  calculationResult,
}) => {
  // サブスキルを最大3つまで表示用に整形
  const displaySubSkills: (SelectedSubSkill | null)[] = [...subSkills.slice(0, 3)];
  while (displaySubSkills.length < 3) {
    displaySubSkills.push(null);
  }

  // 現在の日時を取得
  const currentDate = new Date();

  return (
    <div className="bg-card rounded-lg shadow border border-border overflow-hidden">
      {/* ヘッダー */}
      <div className="p-2 border-b border-border">
        {/* 1行目: ポケモン画像・名前・レベル・バッジ・日付 */}
        <div className="flex items-center gap-2 mb-1">
          <PokemonImage pokemonNumber={pokemonNumber} size={40} />
          <h4 className="font-bold text-sm text-foreground">
            {pokemonName}
          </h4>
          <span className="text-[10px] text-muted-foreground">
            Lv.{level}
          </span>
          {pokemonType && (
            <span
              className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${getTokuiStyle(
                pokemonType
              )}`}
            >
              {pokemonType}
            </span>
          )}
          <div className="flex-1"></div>
          <span className="text-[9px] text-muted-foreground">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* 2-3行目グループ: サブスキル、その下に性格 */}
        <div className="ml-9 space-y-0.5">
          {/* サブスキル */}
          <div className="text-[10px] text-foreground flex items-center gap-1 flex-wrap">
            {displaySubSkills.map((skill, index) => {
              if (!skill) return null;
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
          {/* 性格 */}
          {nature && (
            <div className="text-[10px] text-muted-foreground">
              <span className="text-secondary">{nature}</span>
            </div>
          )}
        </div>
      </div>

      {/* 計算結果 */}
      <div className="p-2 bg-muted/20">
        <div className="bg-background rounded border border-border overflow-x-auto">
          <table className="w-full text-[10px]">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  お手伝い
                </th>
                <th className="px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  食材
                </th>
                <th className="px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  スキル
                </th>
                <th className="px-2 py-1 text-left font-semibold text-muted-foreground whitespace-nowrap">
                  きのみ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-2 py-1 font-bold text-foreground whitespace-nowrap">
                  {Math.floor(calculationResult.calculatedSupportTime / 60)}
                  分
                  {calculationResult.calculatedSupportTime % 60}
                  秒
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="font-bold text-orange-600 dark:text-orange-400">
                    {calculationResult.foodHelpsPerDay.toFixed(1)}
                    回/日{" "}
                    <span className="text-foreground text-[9px]">
                      ({(calculationResult.calculatedFoodDropRate * 100).toFixed(1)}%)
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="font-bold text-purple-600 dark:text-purple-400">
                    {calculationResult.skillTriggersPerDay.toFixed(1)}
                    回/日{" "}
                    <span className="text-foreground text-[9px]">
                      ({(calculationResult.calculatedSkillRate * 100).toFixed(1)}%)
                    </span>
                  </div>
                </td>
                <td className="px-2 py-1 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="font-bold text-green-600 dark:text-green-400">
                      {calculationResult.berryHelpsPerDay.toFixed(1)}回/日{" "}
                      <span className="text-foreground text-[9px]">
                        ({((1 - calculationResult.calculatedFoodDropRate) * 100).toFixed(1)}%)
                      </span>
                    </div>
                    <div className="font-bold text-blue-600 dark:text-blue-400 text-[9px]">
                      {calculationResult.berryEnergyPerDay.toLocaleString()}E/日
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
