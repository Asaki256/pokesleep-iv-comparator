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
 * Sub-skills that affect each ranking type
 */
const SKILL_RANKING_SKILLS = [
  "helping_speed_m",
  "helping_speed_s",
  "helping_bonus",
  "skill_trigger_m",
  "skill_trigger_s",
];

const INGREDIENT_RANKING_SKILLS = [
  "helping_speed_m",
  "helping_speed_s",
  "helping_bonus",
  "ingredient_finder_m",
  "ingredient_finder_s",
];

const BERRY_RANKING_SKILLS = [
  "helping_speed_m",
  "helping_speed_s",
  "helping_bonus",
  "berry_finding_s",
];

/**
 * Generate all sub-skill combinations (0 to 3 skills)
 * Only includes skills that affect the specified ranking type
 */
function generateSubSkillCombinations(
  rankingType: "skill" | "ingredient" | "berry"
): SelectedSubSkill[][] {
  const skillList =
    rankingType === "skill"
      ? SKILL_RANKING_SKILLS
      : rankingType === "ingredient"
      ? INGREDIENT_RANKING_SKILLS
      : BERRY_RANKING_SKILLS;

  const relevantSkills = subSkillData.filter((skill) =>
    skillList.includes(skill.name)
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
  // Get all natures
  const allNatures = NATURE_GROUPS.flatMap((group) => group.natures);

  // Generate combinations for each ranking type separately
  const skillCombinations: RankingEntry[] = [];
  const ingredientCombinations: RankingEntry[] = [];
  const berryCombinations: RankingEntry[] = [];

  // Generate skill ranking combinations
  const skillSubSkillCombos = generateSubSkillCombinations("skill");
  for (const nature of allNatures) {
    for (const subSkills of skillSubSkillCombos) {
      const result = calculatePokemonStatsSimple(
        pokemon,
        60,
        nature.name,
        subSkills
      );

      const natureDisplay = nature.up
        ? `${nature.name} (▲${nature.up} ▼${nature.down})`
        : `${nature.name} (補正なし)`;

      skillCombinations.push({
        rank: 0,
        natureName: nature.name,
        natureDisplay,
        subSkills: [...subSkills],
        skillScore: result.skillTriggersPerDay,
        ingredientScore: result.foodHelpsPerDay,
        berryScore: result.berryEnergyPerDay,
      });
    }
  }

  // Generate ingredient ranking combinations
  const ingredientSubSkillCombos = generateSubSkillCombinations("ingredient");
  for (const nature of allNatures) {
    for (const subSkills of ingredientSubSkillCombos) {
      const result = calculatePokemonStatsSimple(
        pokemon,
        60,
        nature.name,
        subSkills
      );

      const natureDisplay = nature.up
        ? `${nature.name} (▲${nature.up} ▼${nature.down})`
        : `${nature.name} (補正なし)`;

      ingredientCombinations.push({
        rank: 0,
        natureName: nature.name,
        natureDisplay,
        subSkills: [...subSkills],
        skillScore: result.skillTriggersPerDay,
        ingredientScore: result.foodHelpsPerDay,
        berryScore: result.berryEnergyPerDay,
      });
    }
  }

  // Generate berry ranking combinations
  const berrySubSkillCombos = generateSubSkillCombinations("berry");
  for (const nature of allNatures) {
    for (const subSkills of berrySubSkillCombos) {
      const result = calculatePokemonStatsSimple(
        pokemon,
        60,
        nature.name,
        subSkills
      );

      const natureDisplay = nature.up
        ? `${nature.name} (▲${nature.up} ▼${nature.down})`
        : `${nature.name} (補正なし)`;

      berryCombinations.push({
        rank: 0,
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
  const skillRanking = skillCombinations
    .sort((a, b) => b.skillScore - a.skillScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  // Sort by ingredient score (descending) and assign ranks
  const ingredientRanking = ingredientCombinations
    .sort((a, b) => b.ingredientScore - a.ingredientScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  // Sort by berry score (descending) and assign ranks
  const berryRanking = berryCombinations
    .sort((a, b) => b.berryScore - a.berryScore)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

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

/**
 * Ensure user's current combination is included in the ranking.
 * If not found, calculate and insert it at the appropriate position.
 */
export function ensureUserRankInRanking(
  ranking: RankingEntry[],
  pokemon: Pokemon,
  natureName: string | undefined,
  subSkills: SelectedSubSkill[],
  rankingType: "skill" | "ingredient" | "berry"
): RankingEntry[] {
  if (!natureName) return ranking;

  // Check if user's combination already exists
  const existingIndex = findMyRank(ranking, natureName, subSkills);
  if (existingIndex !== null) {
    return ranking; // Already exists, no need to add
  }

  // Calculate score for user's combination
  const result = calculatePokemonStatsSimple(
    pokemon,
    60,
    natureName,
    subSkills
  );

  // Get nature display from nature data
  const allNatures = NATURE_GROUPS.flatMap((group) => group.natures);
  const nature = allNatures.find((n) => n.name === natureName);
  if (!nature) return ranking;

  const natureDisplay = nature.up
    ? `${nature.name} (▲${nature.up} ▼${nature.down})`
    : `${nature.name} (補正なし)`;

  // Create entry for user's combination
  const userEntry: RankingEntry = {
    rank: 0, // Will be set after sorting
    natureName: nature.name,
    natureDisplay,
    subSkills: [...subSkills],
    skillScore: result.skillTriggersPerDay,
    ingredientScore: result.foodHelpsPerDay,
    berryScore: result.berryEnergyPerDay,
  };

  // Add user's entry to ranking
  const newRanking = [...ranking, userEntry];

  // Sort by the appropriate score and reassign ranks
  const sortedRanking = newRanking.sort((a, b) => {
    switch (rankingType) {
      case "skill":
        return b.skillScore - a.skillScore;
      case "ingredient":
        return b.ingredientScore - a.ingredientScore;
      case "berry":
        return b.berryScore - a.berryScore;
    }
  });

  // Reassign ranks
  return sortedRanking.map((entry, index) => ({
    ...entry,
    rank: index + 1,
  }));
}
