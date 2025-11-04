import { Pokemon } from "@/types/pokemon";
import { kinomiData } from "@/data/kinomiData";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { NATURE_GROUPS } from "@/data/natureData";

/**
 * 性格補正値の型定義
 */
interface NatureMultipliers {
  speed: number;
  ingredient: number;
  skill: number;
}

/**
 * 性格名から補正値を取得
 * natureData.tsのNATURE_GROUPSから性格を検索
 */
export const getNatureMultipliers = (
  natureName: string
): NatureMultipliers => {
  // NATURE_GROUPSから性格を検索
  for (const group of NATURE_GROUPS) {
    const nature = group.natures.find((n) => n.name === natureName);
    if (nature) {
      return {
        speed: nature.speedMultiplier,
        ingredient: nature.ingredientMultiplier,
        skill: nature.skillMultiplier,
      };
    }
  }

  // 見つからない場合はデフォルト（補正なし）
  return { speed: 1.0, ingredient: 1.0, skill: 1.0 };
};

/**
 * 計算に必要な入力パラメータ
 */
export interface CalculationParams {
  /** 対象ポケモンのデータ */
  pokemon: Pokemon;
  /** レベル (デフォルト: 60) */
  level?: number;
  /** おてつだいスピード性格補正 (1.0: 補正なし, 0.9: 上昇補正, 1.075: 下降補正) */
  speedNatureMultiplier?: number;
  /** 食材確率性格補正 (1.0: 補正なし, 1.2: 上昇補正, 0.8: 下降補正) */
  ingredientNatureMultiplier?: number;
  /** スキル確率性格補正 (1.0: 補正なし, 1.2: 上昇補正, 0.8: 下降補正) */
  skillNatureMultiplier?: number;
  /** おてつだいスピードMの個数 */
  helpingSpeedMCount?: number;
  /** おてつだいスピードSの個数 */
  helpingSpeedSCount?: number;
  /** おてつだいボーナスの個数 */
  helpingBonusCount?: number;
  /** 食材確率アップMの個数 */
  ingredientFinderMCount?: number;
  /** 食材確率アップSの個数 */
  ingredientFinderSCount?: number;
  /** スキル確率アップMの個数 */
  skillTriggerMCount?: number;
  /** スキル確率アップSの個数 */
  skillTriggerSCount?: number;
  /** きのみの数Sの個数 */
  berryFindingSCount?: number;
}

/**
 * 計算結果
 */
export interface CalculationResult {
  /** おてつだい時間(秒) */
  calculatedSupportTime: number;
  /** 食材確率 */
  calculatedFoodDropRate: number;
  /** 食材回数/日 */
  foodHelpsPerDay: number;
  /** スキル確率 */
  calculatedSkillRate: number;
  /** スキル回数/日 */
  skillTriggersPerDay: number;
  /** きのみ回数/日 */
  berryHelpsPerDay: number;
  /** きのみエナジー/日 */
  berryEnergyPerDay: number;
}

/**
 * 定数
 */
const SECONDS_PER_DAY = 132888; // 1日のお手伝い時間(秒)
const SUB_SKILL_REDUCTION_CAP = 0.35; // サブスキルによる軽減幅の上限
const SLEEP_RIBBON_MULTIPLIER = 1.0; // おやすみリボン補正(固定)

/**
 * レベルによる補正を計算
 * 1 - (Lv - 1) * 0.002
 */
const calculateLevelMultiplier = (
  level: number
): number => {
  return 1 - (level - 1) * 0.002;
};

/**
 * サブスキルによる軽減幅を計算
 * = 0.14 * (おてつだいスピードMの個数) + 0.07 * (おてつだいスピードSの個数) + 0.05 * (おてつだいボーナスの個数)
 * 上限: 0.35
 */
const calculateSubSkillReduction = (
  helpingSpeedMCount: number,
  helpingSpeedSCount: number,
  helpingBonusCount: number
): number => {
  const reduction =
    0.14 * helpingSpeedMCount +
    0.07 * helpingSpeedSCount +
    0.05 * helpingBonusCount;
  return Math.min(reduction, SUB_SKILL_REDUCTION_CAP);
};

/**
 * サブスキル補正(倍率)を計算
 * = 1 - サブスキルによる軽減幅
 */
const calculateSubSkillMultiplier = (
  helpingSpeedMCount: number,
  helpingSpeedSCount: number,
  helpingBonusCount: number
): number => {
  const reduction = calculateSubSkillReduction(
    helpingSpeedMCount,
    helpingSpeedSCount,
    helpingBonusCount
  );
  return 1 - reduction;
};

/**
 * おてつだい時間を計算
 * Floor[ 基準おてつだい時間 × レベルによる補正 × おてつだいスピード性格補正 × サブスキル補正 × おやすみリボン補正 ]
 */
export const calculateSupportTime = (
  params: CalculationParams
): number => {
  const {
    pokemon,
    level = 60,
    speedNatureMultiplier = 1.0,
    helpingSpeedMCount = 0,
    helpingSpeedSCount = 0,
    helpingBonusCount = 0,
  } = params;

  const levelMultiplier = calculateLevelMultiplier(level);
  const subSkillMultiplier = calculateSubSkillMultiplier(
    helpingSpeedMCount,
    helpingSpeedSCount,
    helpingBonusCount
  );

  const calculatedTime =
    pokemon.supportTime *
    levelMultiplier *
    speedNatureMultiplier *
    subSkillMultiplier *
    SLEEP_RIBBON_MULTIPLIER;

  return Math.floor(calculatedTime);
};

/**
 * おてつだい回数(/日)を計算
 * = 132888 / (CalculatedSupportTime)
 */
export const calculateHelpsPerDay = (
  calculatedSupportTime: number
): number => {
  return SECONDS_PER_DAY / calculatedSupportTime;
};

/**
 * 食材確率を計算
 * (calculatedFoodDropRate) = (pokemonData.foodDropRate) × (1 + (食材確率アップMの数) × 0.36 + (食材確率アップSの数) × 0.18 ) × 食材確率性格補正
 */
export const calculateFoodDropRate = (
  params: CalculationParams
): number => {
  const {
    pokemon,
    ingredientNatureMultiplier = 1.0,
    ingredientFinderMCount = 0,
    ingredientFinderSCount = 0,
  } = params;

  const subSkillBonus =
    1 +
    ingredientFinderMCount * 0.36 +
    ingredientFinderSCount * 0.18;

  return (
    pokemon.foodDropRate *
    subSkillBonus *
    ingredientNatureMultiplier
  );
};

/**
 * 食材お手伝い回数(/日)を計算
 * = おてつだい回数 × (calculatedFoodDropRate)
 */
export const calculateFoodHelpsPerDay = (
  helpsPerDay: number,
  calculatedFoodDropRate: number
): number => {
  return helpsPerDay * calculatedFoodDropRate;
};

/**
 * スキル確率を計算
 * (calculatedSkillRate) = (pokemonData.skillRate) × (1 + (スキル確率アップMの数) × 0.36 + (スキル確率アップSの数) × 0.18 ) × スキル確率性格補正
 */
export const calculateSkillRate = (
  params: CalculationParams
): number => {
  const {
    pokemon,
    skillNatureMultiplier = 1.0,
    skillTriggerMCount = 0,
    skillTriggerSCount = 0,
  } = params;

  const subSkillBonus =
    1 +
    skillTriggerMCount * 0.36 +
    skillTriggerSCount * 0.18;

  return (
    pokemon.skillRate *
    subSkillBonus *
    skillNatureMultiplier
  );
};

/**
 * スキル回数の期待値(/日)を計算
 * = おてつだい回数 × (calculatedSkillRate)
 */
export const calculateSkillTriggersPerDay = (
  helpsPerDay: number,
  calculatedSkillRate: number
): number => {
  return helpsPerDay * calculatedSkillRate;
};

/**
 * きのみお手伝い回数(/日)を計算
 * = おてつだい回数 × (1 - (calculatedFoodDropRate))
 */
export const calculateBerryHelpsPerDay = (
  helpsPerDay: number,
  calculatedFoodDropRate: number
): number => {
  return helpsPerDay * (1 - calculatedFoodDropRate);
};

/**
 * きのみの数を計算
 * ルール:
 * - すべてのポケモン: 基本1個
 * - きのみタイプまたはオールタイプ: +1個
 * - サブスキル「きのみの数S」: +1個ずつ
 */
export const calculateBerryCount = (
  pokemon: Pokemon,
  berryFindingSCount: number = 0
): number => {
  let count = 1; // 基本1個

  // きのみタイプまたはオールタイプは+1個
  if (pokemon.type === "きのみ" || pokemon.type === "オール") {
    count++;
  }

  // サブスキル「きのみの数S」の個数分追加
  count += berryFindingSCount;

  return count;
};

/**
 * きのみエナジー(/回)を計算
 * MAX[ (pokemonData.kinomiTypeと一致するkinomiData.energy) + (Lv-1), (pokemonData.kinomiTypeと一致するkinomiData.energy) × 1.025 ^ (レベル - 1) ]
 * きのみの数による倍率も適用する
 */
export const calculateBerryEnergyPerHelp = (
  pokemon: Pokemon,
  level: number = 60,
  berryCount: number = 1
): number => {
  const kinomiInfo = kinomiData.find(
    (k) => k.type === pokemon.kinomiType
  );
  if (!kinomiInfo) {
    throw new Error(
      `きのみタイプ "${pokemon.kinomiType}" が見つかりません`
    );
  }

  const baseEnergy = kinomiInfo.energy;
  const linearGrowth = baseEnergy + (level - 1);
  const exponentialGrowth =
    baseEnergy * Math.pow(1.025, level - 1);

  // きのみ1個あたりのエナジーにきのみの数を掛ける
  const energyPerBerry = Math.max(linearGrowth, exponentialGrowth);
  return energyPerBerry * berryCount;
};

/**
 * きのみエナジー(/日)を計算
 * = きのみお手伝い回数(/日) × (きのみエナジー/回)
 */
export const calculateBerryEnergyPerDay = (
  berryHelpsPerDay: number,
  berryEnergyPerHelp: number
): number => {
  return Math.floor(berryHelpsPerDay * berryEnergyPerHelp);
};

/**
 * すべての計算を行い、結果を返す
 */
export const calculatePokemonStats = (
  params: CalculationParams
): CalculationResult => {
  const level = params.level ?? 60;

  // おてつだい時間
  const calculatedSupportTime =
    calculateSupportTime(params);

  // おてつだい回数/日
  const helpsPerDay = calculateHelpsPerDay(
    calculatedSupportTime
  );

  // 食材確率
  const calculatedFoodDropRate =
    calculateFoodDropRate(params);

  // 食材回数/日
  const foodHelpsPerDay = calculateFoodHelpsPerDay(
    helpsPerDay,
    calculatedFoodDropRate
  );

  // スキル確率
  const calculatedSkillRate = calculateSkillRate(params);

  // スキル回数/日
  const skillTriggersPerDay = calculateSkillTriggersPerDay(
    helpsPerDay,
    calculatedSkillRate
  );

  // きのみ回数/日
  const berryHelpsPerDay = calculateBerryHelpsPerDay(
    helpsPerDay,
    calculatedFoodDropRate
  );

  // きのみの数を計算
  const berryCount = calculateBerryCount(
    params.pokemon,
    params.berryFindingSCount ?? 0
  );

  // きのみエナジー/回
  const berryEnergyPerHelp = calculateBerryEnergyPerHelp(
    params.pokemon,
    level,
    berryCount
  );

  // きのみエナジー/日
  const berryEnergyPerDay = calculateBerryEnergyPerDay(
    berryHelpsPerDay,
    berryEnergyPerHelp
  );

  return {
    calculatedSupportTime,
    calculatedFoodDropRate,
    foodHelpsPerDay,
    calculatedSkillRate,
    skillTriggersPerDay,
    berryHelpsPerDay,
    berryEnergyPerDay,
  };
};

/**
 * サブスキル配列から各サブスキルの個数を集計
 */
interface SubSkillCounts {
  helpingSpeedM: number;
  helpingSpeedS: number;
  helpingBonus: number;
  ingredientFinderM: number;
  ingredientFinderS: number;
  skillTriggerM: number;
  skillTriggerS: number;
  berryFindingS: number;
}

export const countSubSkills = (
  subSkills: SelectedSubSkill[]
): SubSkillCounts => {
  const counts: SubSkillCounts = {
    helpingSpeedM: 0,
    helpingSpeedS: 0,
    helpingBonus: 0,
    ingredientFinderM: 0,
    ingredientFinderS: 0,
    skillTriggerM: 0,
    skillTriggerS: 0,
    berryFindingS: 0,
  };

  for (const subSkill of subSkills) {
    switch (subSkill.baseId) {
      // おてつだいスピードM (variantベースとnameベースの両方をサポート)
      case "supportSpeedM":
      case "helping_speed_m":
        counts.helpingSpeedM++;
        break;
      // おてつだいスピードS (variantベースとnameベースの両方をサポート)
      case "supportSpeedS":
      case "helping_speed_s":
        counts.helpingSpeedS++;
        break;
      case "helping_bonus":
        counts.helpingBonus++;
        break;
      // 食材確率アップM (variantベースとnameベースの両方をサポート)
      case "ingredientFinderM":
      case "ingredient_finder_m":
        counts.ingredientFinderM++;
        break;
      // 食材確率アップS (variantベースとnameベースの両方をサポート)
      case "ingredientFinderS":
      case "ingredient_finder_s":
        counts.ingredientFinderS++;
        break;
      // スキル確率アップM (variantベースとnameベースの両方をサポート)
      case "skillTriggerM":
      case "skill_trigger_m":
        counts.skillTriggerM++;
        break;
      // スキル確率アップS (variantベースとnameベースの両方をサポート)
      case "skillTriggerS":
      case "skill_trigger_s":
        counts.skillTriggerS++;
        break;
      // きのみの数S
      case "berry_finding_s":
        counts.berryFindingS++;
        break;
    }
  }

  return counts;
};

/**
 * より簡単に使えるラッパー関数
 * ポケモン、レベル、性格名、サブスキル配列を渡すだけで計算結果を取得
 */
export const calculatePokemonStatsSimple = (
  pokemon: Pokemon,
  level: number = 60,
  natureName?: string,
  subSkills: SelectedSubSkill[] = []
): CalculationResult => {
  // 性格補正を取得
  const natureMultipliers = natureName
    ? getNatureMultipliers(natureName)
    : { speed: 1.0, ingredient: 1.0, skill: 1.0 };

  // サブスキルの個数を集計
  const subSkillCounts = countSubSkills(subSkills);

  // 計算パラメータを構築
  const params: CalculationParams = {
    pokemon,
    level,
    speedNatureMultiplier: natureMultipliers.speed,
    ingredientNatureMultiplier:
      natureMultipliers.ingredient,
    skillNatureMultiplier: natureMultipliers.skill,
    helpingSpeedMCount: subSkillCounts.helpingSpeedM,
    helpingSpeedSCount: subSkillCounts.helpingSpeedS,
    helpingBonusCount: subSkillCounts.helpingBonus,
    ingredientFinderMCount:
      subSkillCounts.ingredientFinderM,
    ingredientFinderSCount:
      subSkillCounts.ingredientFinderS,
    skillTriggerMCount: subSkillCounts.skillTriggerM,
    skillTriggerSCount: subSkillCounts.skillTriggerS,
    berryFindingSCount: subSkillCounts.berryFindingS,
  };

  return calculatePokemonStats(params);
};
