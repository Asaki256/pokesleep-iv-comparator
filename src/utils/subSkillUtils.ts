import { SubSkill, Rarity } from "@/types/subSkill";
import { Variant } from "@/types/selectedSubSkill";

// バリアントを持つスキルグループの定義
export const VARIANT_CONFIG: Record<
  string,
  { variants: Variant[]; label: string }
> = {
  skillTrigger: {
    variants: ["M", "S"],
    label: "スキル確率アップ",
  },
  ingredientFinder: {
    variants: ["M", "S"],
    label: "食材確率アップ",
  },
  skillLevelUp: {
    variants: ["M", "S"],
    label: "スキルレベルアップ",
  },
  supportSpeed: {
    variants: ["M", "S"],
    label: "おてつだいスピード",
  },
  inventoryCapacity: {
    variants: ["L", "M", "S"],
    label: "最大所持数アップ",
  },
};

// スキルがバリアントを持つかどうか
export const hasVariants = (skill: SubSkill): boolean => {
  return (
    skill.skillGroup !== "" &&
    skill.skillGroup in VARIANT_CONFIG
  );
};

// スキルグループの利用可能なバリアント取得
export const getAvailableVariants = (
  skillGroup: string
): Variant[] => {
  return VARIANT_CONFIG[skillGroup]?.variants || [];
};

// レベルの自動割り当て（1つ目: 10, 2つ目: 25, 3つ目: 50, 4つ目: 75, 5つ目: 100）
export const AUTO_LEVELS = [10, 25, 50, 75, 100];

export const getAutoLevel = (index: number): number => {
  return AUTO_LEVELS[index] || 100;
};

// バリアント付きスキル名の生成
export const getSkillNameWithVariant = (
  displayName: string,
  variant: Variant | null
): string => {
  if (!variant) return displayName;
  // 既にバリアントが含まれている場合は除去
  const baseName = displayName.replace(/[MLS]$/, "");
  return `${baseName}${variant}`;
};

// バリアントに基づくレアリティ取得（特定のスキル名から）
export const getRarityByVariant = (
  skillGroup: string,
  variant: Variant
): Rarity => {
  // skillGroupとvariantの組み合わせでレアリティを決定
  if (skillGroup === "inventoryCapacity") {
    return variant === "L"
      ? "blue"
      : variant === "M"
      ? "blue"
      : "gray";
  }
  if (
    skillGroup === "skillTrigger" ||
    skillGroup === "ingredientFinder" ||
    skillGroup === "supportSpeed"
  ) {
    return variant === "M" ? "blue" : "gray";
  }
  if (skillGroup === "skillLevelUp") {
    return variant === "M" ? "gold" : "blue";
  }
  return "gray";
};

// レアリティに応じたスタイルクラスを取得
export const getRarityStyles = (rarity: Rarity) => {
  const styles = {
    gold: {
      gradient:
        "bg-gradient-to-br from-yellow-100 to-amber-100",
      border: "border-yellow-200",
      badge: "bg-yellow-500",
      hover:
        "hover:from-yellow-100 hover:to-amber-100 hover:border-yellow-300",
      chip: "bg-amber-100 text-yellow-700",
      text: "text-yellow-700",
    },
    blue: {
      gradient:
        "bg-gradient-to-br from-cyan-100 to-blue-100",
      border: "border-cyan-200",
      badge: "bg-cyan-500",
      hover:
        "hover:from-cyan-100 hover:to-blue-100 hover:border-cyan-300",
      chip: "bg-cyan-100 text-cyan-700",
      text: "text-cyan-700",
    },
    gray: {
      gradient:
        "bg-gradient-to-br from-gray-100 to-slate-100",
      border: "border-gray-300",
      badge: "bg-gray-500",
      hover:
        "hover:from-gray-200 hover:to-slate-200 hover:border-gray-400",
      chip: "bg-gray-100 text-gray-700",
      text: "text-gray-700",
    },
  };

  return styles[rarity];
};
