"use client";

import { useState, useMemo, useEffect } from "react";
import { Pokemon } from "@/types/pokemon";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useVirtualScroll } from "@/hooks/useVirtualScroll";
import {
  generateRankingData,
  findMyRank,
  ensureUserRankInRanking,
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

  // Update active ranking type when Pokemon changes
  useEffect(() => {
    setActiveRankingType(getInitialRankingType(pokemon));
  }, [pokemon]);

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

  // Ensure user's current combination is in each ranking
  const skillRankingWithUser = useMemo(() => {
    return ensureUserRankInRanking(
      rankingData.skillRanking,
      pokemon,
      currentNature,
      currentSubSkills,
      "skill"
    );
  }, [rankingData.skillRanking, pokemon, currentNature, currentSubSkills]);

  const ingredientRankingWithUser = useMemo(() => {
    return ensureUserRankInRanking(
      rankingData.ingredientRanking,
      pokemon,
      currentNature,
      currentSubSkills,
      "ingredient"
    );
  }, [rankingData.ingredientRanking, pokemon, currentNature, currentSubSkills]);

  const berryRankingWithUser = useMemo(() => {
    return ensureUserRankInRanking(
      rankingData.berryRanking,
      pokemon,
      currentNature,
      currentSubSkills,
      "berry"
    );
  }, [rankingData.berryRanking, pokemon, currentNature, currentSubSkills]);

  // Get current ranking based on active tab
  const currentRanking = useMemo(() => {
    switch (activeRankingType) {
      case "skill":
        return skillRankingWithUser;
      case "ingredient":
        return ingredientRankingWithUser;
      case "berry":
        return berryRankingWithUser;
    }
  }, [
    activeRankingType,
    skillRankingWithUser,
    ingredientRankingWithUser,
    berryRankingWithUser,
  ]);

  // Find current user's rank for each ranking type
  const mySkillRank = useMemo(() => {
    return findMyRank(skillRankingWithUser, currentNature, currentSubSkills);
  }, [skillRankingWithUser, currentNature, currentSubSkills]);

  const myIngredientRank = useMemo(() => {
    return findMyRank(ingredientRankingWithUser, currentNature, currentSubSkills);
  }, [ingredientRankingWithUser, currentNature, currentSubSkills]);

  const myBerryRank = useMemo(() => {
    return findMyRank(berryRankingWithUser, currentNature, currentSubSkills);
  }, [berryRankingWithUser, currentNature, currentSubSkills]);

  // Find current user's rank for active ranking type
  const myRankIndex = useMemo(() => {
    return findMyRank(currentRanking, currentNature, currentSubSkills);
  }, [currentRanking, currentNature, currentSubSkills]);

  // Virtual scroll settings
  const ITEM_HEIGHT = 70; // Height of each ranking entry in pixels (more compact)
  const CONTAINER_HEIGHT = 500; // Height of the scrollable container

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
    { id: "ingredient" as const, label: "食材" },
    { id: "skill" as const, label: "スキル" },
    { id: "berry" as const, label: "きのみ" },
  ];

  // Handle ranking type change with automatic scroll to user's rank
  const handleRankingTypeChange = (type: RankingType) => {
    setActiveRankingType(type);

    // Get the corresponding rank index for the new ranking type
    let targetRankIndex: number | null = null;
    switch (type) {
      case "skill":
        targetRankIndex = mySkillRank;
        break;
      case "ingredient":
        targetRankIndex = myIngredientRank;
        break;
      case "berry":
        targetRankIndex = myBerryRank;
        break;
    }

    // Scroll to the user's rank after state update
    if (targetRankIndex !== null) {
      // Use setTimeout to ensure state update and re-render complete first
      setTimeout(() => {
        virtualScroll.scrollToIndex(targetRankIndex);
      }, 0);
    }
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
        skillRanking={skillRankingWithUser}
        ingredientRanking={ingredientRankingWithUser}
        berryRanking={berryRankingWithUser}
        mySkillRank={mySkillRank}
        myIngredientRank={myIngredientRank}
        myBerryRank={myBerryRank}
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

        {/* Navigation buttons */}
        <div className="flex gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => virtualScroll.scrollToIndex(0)}
            className="flex items-center gap-1 text-xs px-2 md:px-3"
          >
            <ArrowUp className="h-3 w-3" />
            <span className="hidden sm:inline">トップへ</span>
          </Button>
          {myRankIndex !== null && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => virtualScroll.scrollToIndex(myRankIndex)}
              className="flex items-center gap-1 text-xs px-2 md:px-3"
            >
              <span>自分のランク</span>
              <span className="hidden sm:inline">({myRankIndex + 1}位)</span>
            </Button>
          )}
        </div>

        {/* Display range indicator */}
        <div className="text-xs text-muted-foreground mb-2">
          表示: {visibleStartRank}-{visibleEndRank} / 全{currentRanking.length}
          件
        </div>

        {/* Virtual scrolling container */}
        <div
          ref={virtualScroll.containerRef}
          className="border border-border rounded-lg overflow-y-auto relative bg-card"
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
                      border-b border-border p-2 md:p-3
                      ${isMyRank ? "bg-accent/20 border-l-2 md:border-l-4 border-l-accent" : ""}
                    `}
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
