"use client";

import { Pokemon } from "@/types/pokemon";

type RankingType = "skill" | "ingredient" | "berry";

interface SelectedRankData {
  rank: number;
  score: number;
  totalCombinations: number;
}

interface IVAnalysisComponentProps {
  pokemon: Pokemon;
  selectedSkillRank: SelectedRankData;
  selectedIngredientRank: SelectedRankData;
  selectedBerryRank: SelectedRankData;
  onRankingTypeChange: (type: RankingType) => void;
}

export default function IVAnalysisComponent({
  pokemon,
  selectedSkillRank,
  selectedIngredientRank,
  selectedBerryRank,
  onRankingTypeChange,
}: IVAnalysisComponentProps) {
  // ランキングとパーセンテージを計算
  const getRankDisplay = (rankData: SelectedRankData) => {
    const percentage = (
      (rankData.rank / rankData.totalCombinations) *
      100
    ).toFixed(1);
    return {
      rankText: `${rankData.rank}位`,
      percentText: `上位${percentage}%`,
    };
  };

  const skillRankDisplay = getRankDisplay(selectedSkillRank);
  const ingredientRankDisplay = getRankDisplay(selectedIngredientRank);
  const berryRankDisplay = getRankDisplay(selectedBerryRank);

  // ポケモンのタイプに応じて強調すべき項目を判定
  const shouldEmphasize = (rowType: RankingType): boolean => {
    if (pokemon.type === "スキル" && rowType === "skill") return true;
    if (pokemon.type === "食材" && rowType === "ingredient") return true;
    if (pokemon.type === "きのみ" && rowType === "berry") return true;
    if (pokemon.type === "オール") return true;
    return false;
  };

  // テーブル行のデータ
  const tableRows = [
    {
      type: "ingredient" as RankingType,
      label: "食材回数",
      score: selectedIngredientRank.score.toFixed(1),
      rank: ingredientRankDisplay.rankText,
      percent: ingredientRankDisplay.percentText,
    },
    {
      type: "skill" as RankingType,
      label: "スキル回数",
      score: selectedSkillRank.score.toFixed(1),
      rank: skillRankDisplay.rankText,
      percent: skillRankDisplay.percentText,
    },
    {
      type: "berry" as RankingType,
      label: "きのみエナジー",
      score: selectedBerryRank.score.toFixed(1),
      rank: berryRankDisplay.rankText,
      percent: berryRankDisplay.percentText,
    },
  ];

  return (
    <div className="mb-6 p-5 bg-card rounded-xl border border-border shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-sm md:text-base font-bold text-foreground mb-4">
        {pokemon.displayName} の個体値分析
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs md:text-sm">
          <thead>
            <tr className="border-b-2 border-border">
              <th className="text-left py-3 px-2 md:px-3 font-semibold text-muted-foreground">
                項目
              </th>
              <th className="text-right py-3 px-2 md:px-3 font-semibold text-muted-foreground">
                値/日
              </th>
              <th className="text-center py-3 px-2 md:px-3 font-semibold text-muted-foreground">
                順位
              </th>
              <th className="text-center py-3 px-2 md:px-3 font-semibold text-muted-foreground">
                割合
              </th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row) => {
              const isEmphasized = shouldEmphasize(row.type);
              return (
                <tr
                  key={row.type}
                  onClick={() => onRankingTypeChange(row.type)}
                  className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <td
                    className={`py-3 px-2 md:px-3 ${isEmphasized ? "font-bold" : "font-medium"} text-foreground`}
                  >
                    {row.label}
                  </td>
                  <td
                    className={`py-3 px-2 md:px-3 text-right ${isEmphasized ? "font-bold" : "font-semibold"} text-foreground`}
                  >
                    {row.score}
                  </td>
                  <td className="py-3 px-2 md:px-3 text-center">
                    <span className="inline-block px-3 py-1.5 bg-accent text-accent-foreground rounded-lg font-bold text-xs md:text-sm shadow-sm">
                      {row.rank}
                    </span>
                  </td>
                  <td
                    className={`py-3 px-2 md:px-3 text-center ${isEmphasized ? "font-bold" : ""} text-muted-foreground`}
                  >
                    {row.percent}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground mt-4 text-center">
        クリックすると対応するランキングタブに切り替わります
      </p>
    </div>
  );
}
