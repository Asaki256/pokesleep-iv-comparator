"use client";

import React from "react";
import { CalculationResult } from "@/utils/pokemonCalculator";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { getRarityStyles } from "@/utils/subSkillUtils";

// 型定義
interface CalculatedPokemonInfoProps {
  pokemonName: string;
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
    <div className="bg-linear-to-br from-sky-50 to-cyan-50 rounded-lg shadow-md border-2 border-cyan-200 overflow-hidden">
      {/* ヘッダー */}
      <div className="p-2 md:p-3">
        {/* 1行目: ポケモン画像・名前・バッジ・日付 */}
        <div className="flex items-center gap-2 md:gap-3 mb-1.5">
          <div className="text-xl md:text-2xl">🎮</div>
          <h4 className="font-bold text-sm md:text-base text-gray-900">
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
          <span className="text-[9px] md:text-[10px] text-gray-600 font-medium">
            {formatDate(currentDate)}
          </span>
        </div>

        {/* 2-3行目グループ: 性格とサブスキル */}
        <div className="ml-8 md:ml-10 space-y-0.5">
          {nature && (
            <div className="text-[10px] md:text-xs text-gray-700">
              <span className="font-semibold">性格:</span>{" "}
              {nature}
            </div>
          )}
          <div className="text-[10px] md:text-xs text-gray-700">
            <span className="font-semibold">
              サブスキル:
            </span>{" "}
            {displaySubSkills.map((skill, index) => {
              if (!skill) {
                return (
                  <span
                    key={index}
                    className="inline-block px-1.5 py-0.5 rounded mx-0.5 bg-gray-50 text-gray-400 border border-gray-200"
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
        </div>
      </div>

      {/* 計算結果 */}
      <div className="p-2 md:p-3 bg-white bg-opacity-50">
        <div className="bg-white rounded border border-cyan-200 overflow-x-auto">
          <table className="w-full text-[10px] md:text-xs">
            <thead className="bg-cyan-50">
              <tr>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  お手伝い時間
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  食材確率
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  食材/日
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  スキル確率
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  スキル/日
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  きのみ/日
                </th>
                <th className="px-1.5 md:px-2 py-1 text-left font-semibold text-gray-700 whitespace-nowrap">
                  きのみE/日
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                  {calculationResult.calculatedSupportTime.toLocaleString()}
                  秒
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                  {(
                    calculationResult.calculatedFoodDropRate *
                    100
                  ).toFixed(1)}
                  %
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-orange-600 whitespace-nowrap">
                  {calculationResult.foodHelpsPerDay.toFixed(
                    1
                  )}
                  回
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-gray-800 whitespace-nowrap">
                  {(
                    calculationResult.calculatedSkillRate *
                    100
                  ).toFixed(1)}
                  %
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-purple-600 whitespace-nowrap">
                  {calculationResult.skillTriggersPerDay.toFixed(
                    1
                  )}
                  回
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-green-600 whitespace-nowrap">
                  {calculationResult.berryHelpsPerDay.toFixed(
                    1
                  )}
                  回
                </td>
                <td className="px-1.5 md:px-2 py-1.5 font-bold text-blue-600 whitespace-nowrap">
                  {calculationResult.berryEnergyPerDay.toLocaleString()}
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
