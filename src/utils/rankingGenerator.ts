import { Pokemon } from "@/types/pokemon";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { calculatePokemonStatsSimple } from "./pokemonCalculator";
import { NATURE_GROUPS } from "@/data/natureData";
import { subSkillData } from "@/data/subSkillData";

/**
 * Ranking entry for a specific combination
 */
export interface RankingEntry {
  /** Ranking position (1-based) */
  rank: number;
  /** Nature name */
  natureName: string;
  /** Display string for nature */
  natureDisplay: string;
  /** Sub-skills in this combination */
  subSkills: SelectedSubSkill[];
  /** Skill triggers per day */
  skillScore: number;
  /** Ingredient helps per day */
  ingredientScore: number;
  /** Berry energy per day */
  berryScore: number;
}

/**
 * Sub-skills that affect calculations
 */
const CALCULATION_AFFECTING_SKILLS = [
  "helping_speed_m",
  "helping_speed_s",
  "helping_bonus",
  "ingredient_finder_m",
  "ingredient_finder_s",
  "skill_trigger_m",
  "skill_trigger_s",
];

/**
 * Generate all sub-skill combinations (0 to 3 skills)
 * Only includes skills that affect calculations
 */
function generateSubSkillCombinations(): SelectedSubSkill[][] {
  const relevantSkills = subSkillData.filter((skill) =>
    CALCULATION_AFFECTING_SKILLS.includes(skill.name)
  );

  const combinations: SelectedSubSkill[][] = [];

  // Empty combination (no sub-skills)
  combinations.push([]);

  // Generate combinations of 1, 2, and 3 skills
  for (let count = 1; count <= 3; count++) {
    const combos = generateCombinations(relevantSkills, count);
    combinations.push(...combos);
  }

  return combinations;
}

/**
 * Helper function to generate combinations of specific size
 */
function generateCombinations(
  skills: typeof subSkillData,
  size: number
): SelectedSubSkill[][] {
  const results: SelectedSubSkill[][] = [];

  function backtrack(start: number, current: SelectedSubSkill[]) {
    if (current.length === size) {
      results.push([...current]);
      return;
    }

    for (let i = start; i < skills.length; i++) {
      const skill = skills[i];
      const level = current.length === 0 ? 10 : current.length === 1 ? 25 : 50;

      const selectedSkill: SelectedSubSkill = {
        id: `${skill.name}_${level}_${Date.now()}_${Math.random()}`,
        baseId: skill.name,
        name: skill.displayName,
        variant: null,
        level: level,
        rarity: skill.rarity,
      };

      current.push(selectedSkill);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return results;
}

/**
 * Generate ranking data for all nature and sub-skill combinations
 */
export function generateRankingData(
  pokemon: Pokemon
): {
  skillRanking: RankingEntry[];
  ingredientRanking: RankingEntry[];
  berryRanking: RankingEntry[];
} {
  const allCombinations: RankingEntry[] = [];

  // Get all natures
  const allNatures = NATURE_GROUPS.flatMap((group) => group.natures);

  // Get all sub-skill combinations
  const subSkillCombinations = generateSubSkillCombinations();

  // Calculate score for each combination
  for (const nature of allNatures) {
    for (const subSkills of subSkillCombinations) {
      const result = calculatePokemonStatsSimple(
        pokemon,
        60,
        nature.name,
        subSkills
      );

      const natureDisplay = nature.up
        ? `${nature.name} (▲${nature.up} ▼${nature.down})`
        : `${nature.name} (補正なし)`;

      allCombinations.push({
        rank: 0, // Will be set after sorting
        natureName: nature.name,
        natureDisplay,
        subSkills: [...subSkills],
        skillScore: result.skillTriggersPerDay,
        ingredientScore: result.foodHelpsPerDay,
        berryScore: result.berryEnergyPerDay,
      });
    }
  }

  // Sort by skill score (descending) and assign ranks
  const skillRanking = [...allCombinations].sort(
    (a, b) => b.skillScore - a.skillScore
  );
  skillRanking.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Sort by ingredient score (descending) and assign ranks
  const ingredientRanking = [...allCombinations].sort(
    (a, b) => b.ingredientScore - a.ingredientScore
  );
  ingredientRanking.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  // Sort by berry score (descending) and assign ranks
  const berryRanking = [...allCombinations].sort(
    (a, b) => b.berryScore - a.berryScore
  );
  berryRanking.forEach((entry, index) => {
    entry.rank = index + 1;
  });

  return {
    skillRanking,
    ingredientRanking,
    berryRanking,
  };
}

/**
 * Find the rank of a specific combination in the ranking
 */
export function findMyRank(
  ranking: RankingEntry[],
  natureName: string | undefined,
  subSkills: SelectedSubSkill[]
): number | null {
  if (!natureName) return null;

  // Normalize sub-skills for comparison
  const normalizedSubSkills = subSkills
    .map((s) => s.baseId)
    .sort()
    .join(",");

  const index = ranking.findIndex((entry) => {
    const entrySubSkills = entry.subSkills
      .map((s) => s.baseId)
      .sort()
      .join(",");
    return entry.natureName === natureName && entrySubSkills === normalizedSubSkills;
  });

  return index >= 0 ? index : null;
}
