"use client";

import { useState, useMemo, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { Button } from "@/components/ui/button";
import { ArrowUp, Target } from "lucide-react";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import {
  generateRankingData,
  findMyRank,
  RankingEntry,
} from "@/utils/rankingGenerator";
import { getRarityStyles } from "@/utils/subSkillUtils";

type RankingType = "skill" | "ingredient" | "berry";

interface CombinationRankingProps {
  pokemon: Pokemon;
  currentNature?: string;
  currentSubSkills: SelectedSubSkill[];
}

export default function CombinationRanking({
  pokemon,
  currentNature,
  currentSubSkills,
}: CombinationRankingProps) {
  const [activeRankingType, setActiveRankingType] =
    useState<RankingType>("skill");
  const [isGenerating, setIsGenerating] = useState(true);

  // Generate ranking data (memoized)
  const rankingData = useMemo(() => {
    setIsGenerating(true);
    const startTime = performance.now();
    const data = generateRankingData(pokemon);
    const endTime = performance.now();
    console.log(`Ranking generation time: ${endTime - startTime}ms`);
    setIsGenerating(false);
    return data;
  }, [pokemon]);

  // Get current ranking based on active tab
  const currentRanking = useMemo(() => {
    switch (activeRankingType) {
      case "skill":
        return rankingData.skillRanking;
      case "ingredient":
        return rankingData.ingredientRanking;
      case "berry":
        return rankingData.berryRanking;
    }
  }, [activeRankingType, rankingData]);

  // Find current user's rank
  const myRankIndex = useMemo(() => {
    return findMyRank(currentRanking, currentNature, currentSubSkills);
  }, [currentRanking, currentNature, currentSubSkills]);

  // Virtual scroll settings
  const ITEM_HEIGHT = 80; // Height of each ranking entry in pixels
  const CONTAINER_HEIGHT = 600; // Height of the scrollable container

  const virtualScroll = useVirtualScroll({
    totalItems: currentRanking.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  // Calculate visible range
  const visibleStartRank = virtualScroll.startIndex + 1;
  const visibleEndRank = Math.min(
    virtualScroll.endIndex + 1,
    currentRanking.length
  );

  // Get score label based on ranking type
  const getScoreLabel = (type: RankingType): string => {
    switch (type) {
      case "skill":
        return "スキル回数/日";
      case "ingredient":
        return "食材回数/日";
      case "berry":
        return "きのみエナジー/日";
    }
  };

  // Get score value from entry
  const getScore = (entry: RankingEntry, type: RankingType): number => {
    switch (type) {
      case "skill":
        return entry.skillScore;
      case "ingredient":
        return entry.ingredientScore;
      case "berry":
        return entry.berryScore;
    }
  };

  // Format score for display
  const formatScore = (score: number): string => {
    return score.toFixed(1);
  };

  const rankingTabs = [
    { id: "skill" as const, label: "スキル" },
    { id: "ingredient" as const, label: "食材" },
    { id: "berry" as const, label: "きのみ" },
  ];

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <p className="text-sm text-gray-600">ランキングを生成中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Sub-tabs for ranking type */}
      <div className="flex border-b border-gray-300 mb-4">
        {rankingTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveRankingType(tab.id)}
            className={`
              flex-1 px-3 py-2 text-xs md:text-sm font-medium transition-colors
              ${
                activeRankingType === tab.id
                  ? "border-b-2 border-cyan-500 text-cyan-600 bg-cyan-50"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="flex gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => virtualScroll.scrollToIndex(0)}
          className="flex items-center gap-1 text-xs"
        >
          <ArrowUp className="h-3 w-3" />
          トップへ
        </Button>
        {myRankIndex !== null && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => virtualScroll.scrollToIndex(myRankIndex)}
            className="flex items-center gap-1 text-xs"
          >
            <Target className="h-3 w-3" />
            自分のランク ({myRankIndex + 1}位)
          </Button>
        )}
      </div>

      {/* Display range indicator */}
      <div className="text-xs text-gray-600 mb-2">
        表示: {visibleStartRank}-{visibleEndRank} / 全{currentRanking.length}
        件
      </div>

      {/* Virtual scrolling container */}
      <div
        ref={virtualScroll.containerRef}
        className="border border-gray-300 rounded-lg overflow-y-auto relative"
        style={{ height: `${CONTAINER_HEIGHT}px` }}
      >
        {/* Spacer for total height */}
        <div style={{ height: `${virtualScroll.totalHeight}px` }}>
          {/* Visible items container */}
          <div
            style={{
              transform: `translateY(${virtualScroll.offsetY}px)`,
            }}
          >
            {virtualScroll.visibleItems.map((index) => {
              const entry = currentRanking[index];
              const isMyRank = index === myRankIndex;
              const score = getScore(entry, activeRankingType);

              return (
                <div
                  key={index}
                  className={`
                    border-b border-gray-200 p-3
                    ${isMyRank ? "bg-yellow-50 border-l-4 border-l-yellow-500" : ""}
                  `}
                  style={{ height: `${ITEM_HEIGHT}px` }}
                >
                  <div className="flex items-center gap-3 h-full">
                    {/* Rank number */}
                    <div
                      className={`
                        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm
                        ${
                          entry.rank === 1
                            ? "bg-yellow-400 text-yellow-900"
                            : entry.rank === 2
                            ? "bg-gray-300 text-gray-800"
                            : entry.rank === 3
                            ? "bg-amber-600 text-white"
                            : "bg-gray-100 text-gray-700"
                        }
                      `}
                    >
                      {entry.rank}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-800">
                          {entry.natureDisplay}
                        </span>
                        {isMyRank && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-500 text-white rounded-full font-medium">
                            現在
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {entry.subSkills.length === 0 ? (
                          <span className="text-xs text-gray-500 italic">
                            サブスキルなし
                          </span>
                        ) : (
                          entry.subSkills.map((skill, idx) => {
                            const rarityStyle = getRarityStyles(skill.rarity);
                            return (
                              <span
                                key={idx}
                                className={`text-xs px-2 py-0.5 rounded-md font-medium ${rarityStyle.chip}`}
                              >
                                {skill.name}
                              </span>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Score */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {formatScore(score)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {getScoreLabel(activeRankingType)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 text-xs text-gray-600">
        <p>
          {pokemon.displayName}の全{currentRanking.length}
          通りの組み合わせから、{getScoreLabel(activeRankingType)}
          の降順でランキング表示しています。
        </p>
      </div>
    </div>
  );
}
