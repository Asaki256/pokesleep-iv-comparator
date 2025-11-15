"use client";

import { useState, useMemo, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import {
  generateRankingData,
  calculateSelectedRank,
  RankingEntry,
} from "@/utils/rankingGenerator";
import { getRarityStyles } from "@/utils/subSkillUtils";
import IVAnalysisComponent from "./IVAnalysisComponent";

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
  // Determine initial ranking type based on Pokemon specialty
  const getInitialRankingType = (pokemon: Pokemon): RankingType => {
    switch (pokemon.type) {
      case "スキル":
        return "skill";
      case "きのみ":
        return "berry";
      case "食材":
        return "ingredient";
      case "オール":
      default:
        return "ingredient";
    }
  };

  const [activeRankingType, setActiveRankingType] = useState<RankingType>(
    getInitialRankingType(pokemon)
  );
  const [isGenerating, setIsGenerating] = useState(true);

  // Update active ranking type when Pokemon changes (deferred to avoid cascading renders)
  useEffect(() => {
    queueMicrotask(() => {
      setActiveRankingType(getInitialRankingType(pokemon));
    });
  }, [pokemon]);

  // Generate ranking data (memoized)
  const rankingData = useMemo(() => {
    return generateRankingData(pokemon, currentNature, currentSubSkills);
  }, [pokemon, currentNature, currentSubSkills]);

  // Track generation completion (deferred to avoid cascading renders)
  useEffect(() => {
    queueMicrotask(() => {
      setIsGenerating(false);
    });
  }, [rankingData]);

  // Calculate virtual ranks for selected combination
  const selectedSkillRank = useMemo(() => {
    return calculateSelectedRank(pokemon, currentNature, currentSubSkills, "skill");
  }, [pokemon, currentNature, currentSubSkills]);

  const selectedIngredientRank = useMemo(() => {
    return calculateSelectedRank(pokemon, currentNature, currentSubSkills, "ingredient");
  }, [pokemon, currentNature, currentSubSkills]);

  const selectedBerryRank = useMemo(() => {
    return calculateSelectedRank(pokemon, currentNature, currentSubSkills, "berry");
  }, [pokemon, currentNature, currentSubSkills]);

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
  }, [
    activeRankingType,
    rankingData.skillRanking,
    rankingData.ingredientRanking,
    rankingData.berryRanking,
  ]);

  // Get current selected rank data based on active tab
  const currentSelectedRank = useMemo(() => {
    switch (activeRankingType) {
      case "skill":
        return selectedSkillRank;
      case "ingredient":
        return selectedIngredientRank;
      case "berry":
        return selectedBerryRank;
    }
  }, [activeRankingType, selectedSkillRank, selectedIngredientRank, selectedBerryRank]);

  // Handle click on selected combination card to scroll to approximate rank position
  const handleScrollToSelectedRank = () => {
    // Since the selected combination is excluded from the ranking,
    // we need to adjust the scroll position:
    // - If rank is 1, scroll to index 0 (top)
    // - If rank is N, the list shows: 1,2,...,N-1,N+1,N+2,...
    // - To see the position around rank N, scroll to index N-1 (which shows rank N+1)
    // - But to center better, we scroll to index N-2 when rank > 1
    const targetIndex = currentSelectedRank.rank === 1 ? 0 : Math.max(0, currentSelectedRank.rank - 2);
    scrollToIndex(targetIndex);
  };

  // Virtual scroll settings
  const ITEM_HEIGHT = 70; // Height of each ranking entry in pixels (more compact)
  const CONTAINER_HEIGHT = 500; // Height of the scrollable container

  const {
    startIndex,
    endIndex,
    visibleItems,
    totalHeight,
    offsetY,
    containerRef,
    scrollToIndex,
  } = useVirtualScroll({
    totalItems: currentRanking.length,
    itemHeight: ITEM_HEIGHT,
    containerHeight: CONTAINER_HEIGHT,
    overscan: 5,
  });

  // Calculate visible range
  const visibleStartRank = startIndex + 1;
  const visibleEndRank = Math.min(
    endIndex + 1,
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
    { id: "ingredient" as const, label: "食材" },
    { id: "skill" as const, label: "スキル" },
    { id: "berry" as const, label: "きのみ" },
  ];

  // Handle ranking type change
  const handleRankingTypeChange = (type: RankingType) => {
    setActiveRankingType(type);

    // Scroll to the selected rank position after tab change
    // Use setTimeout to ensure state update completes first
    setTimeout(() => {
      const rankData =
        type === "skill" ? selectedSkillRank :
        type === "ingredient" ? selectedIngredientRank :
        selectedBerryRank;

      // Adjust index since selected combination is excluded from ranking
      const targetIndex = rankData.rank === 1 ? 0 : Math.max(0, rankData.rank - 2);
      scrollToIndex(targetIndex);
    }, 100);
  };

  if (isGenerating) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse">
          <p className="text-sm text-muted-foreground">ランキングを生成中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* IV Analysis Component */}
      <IVAnalysisComponent
        pokemon={pokemon}
        selectedSkillRank={selectedSkillRank}
        selectedIngredientRank={selectedIngredientRank}
        selectedBerryRank={selectedBerryRank}
        onRankingTypeChange={handleRankingTypeChange}
      />

      {/* Ranking display card */}
      <div className="bg-card rounded-xl border border-border shadow-lg p-4 md:p-6">
        {/* Sub-tabs for ranking type */}
        <div className="flex border-b border-border mb-4">
          {rankingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRankingType(tab.id)}
              className={`
                flex-1 px-3 py-2 text-xs md:text-sm font-medium transition-colors cursor-pointer
                ${
                  activeRankingType === tab.id
                    ? "border-b-2 border-secondary text-secondary bg-secondary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Selected combination card */}
        <div
          className="mb-4 p-3 bg-accent/20 border-2 border-accent rounded-lg cursor-pointer transition-all hover:bg-accent/30 hover:shadow-md"
          onClick={handleScrollToSelectedRank}
        >
          <div className="flex items-center gap-2 md:gap-3">
            {/* Rank badge */}
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold text-sm md:text-base bg-accent text-accent-foreground">
              {currentSelectedRank.rank}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-foreground">
                  あなたの{pokemon.displayName}の組み合わせ
                </span>
                <span className="text-xs text-muted-foreground">
                  (上位{((currentSelectedRank.rank / currentSelectedRank.totalCombinations) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-medium text-foreground">
                  {currentNature || "すなお"}
                </span>
                <div className="flex flex-wrap gap-1">
                  {currentSubSkills.length === 0 ? (
                    <span className="text-xs text-muted-foreground italic">
                      サブスキルなし
                    </span>
                  ) : (
                    currentSubSkills.map((skill, idx) => {
                      const rarityStyle = getRarityStyles(skill.rarity);
                      return (
                        <span
                          key={idx}
                          className={`inline-block text-xs px-1.5 md:px-2 py-0.5 rounded-md font-medium ${rarityStyle.chip}`}
                          title={skill.name}
                        >
                          {skill.name}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="flex-shrink-0 text-right">
              <div className="text-sm md:text-base font-bold text-foreground">
                {currentSelectedRank.score.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeRankingType === "berry" ? "エナジー/日" : "回/日"}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => scrollToIndex(0)}
            className="flex items-center gap-1 text-xs px-2 md:px-3"
          >
            <ArrowUp className="h-3 w-3" />
            <span className="hidden sm:inline">トップへ</span>
          </Button>
        </div>

        {/* Display range indicator */}
        <div className="text-xs text-muted-foreground mb-2">
          表示: {visibleStartRank}-{visibleEndRank} / 全{currentRanking.length}
          件
        </div>

        {/* Virtual scrolling container */}
        <div
          ref={containerRef}
          className="border border-border rounded-lg overflow-y-auto relative bg-card"
          style={{ height: `${CONTAINER_HEIGHT}px` }}
        >
          {/* Spacer for total height */}
          <div style={{ height: `${totalHeight}px` }}>
            {/* Visible items container */}
            <div
              style={{
                transform: `translateY(${offsetY}px)`,
              }}
            >
              {visibleItems.map((index) => {
                const entry = currentRanking[index];
                const score = getScore(entry, activeRankingType);

                return (
                  <div
                    key={index}
                    className="border-b border-border p-2 md:p-3"
                    style={{ height: `${ITEM_HEIGHT}px` }}
                  >
                    <div className="flex items-center gap-2 md:gap-3 h-full">
                      {/* Rank number */}
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm
                          ${
                            entry.rank === 1
                              ? "bg-yellow-400 text-yellow-900"
                              : entry.rank === 2
                              ? "bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-100"
                              : entry.rank === 3
                              ? "bg-amber-600 text-white"
                              : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {entry.rank}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 mb-1">
                          <span className="text-xs md:text-sm font-medium text-foreground truncate">
                            {entry.natureDisplay}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-0.5 md:gap-1">
                          {entry.subSkills.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">
                              なし
                            </span>
                          ) : (
                            entry.subSkills.map((skill, idx) => {
                              const rarityStyle = getRarityStyles(skill.rarity);
                              return (
                                <span
                                  key={idx}
                                  className={`inline-block text-xs px-1.5 md:px-2 py-0.5 rounded-md font-medium max-w-[120px] md:max-w-none truncate ${rarityStyle.chip}`}
                                  title={skill.name}
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
                        <div className="text-sm md:text-lg font-bold text-foreground">
                          {formatScore(score)}
                        </div>
                        <div className="text-xs text-muted-foreground hidden md:block">
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
        <div className="mt-3 text-xs text-muted-foreground">
          <p>
            {pokemon.displayName}の全{currentRanking.length}
            通りの組み合わせから、{getScoreLabel(activeRankingType)}
            の降順でランキング表示しています。
          </p>
        </div>
      </div>
    </div>
  );
}
