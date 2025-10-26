import { SubSkill } from "@/types/subSkill";
import {
  SelectedSubSkill,
  Variant,
} from "@/types/selectedSubSkill";
import { subSkillData } from "@/data/subSkillData";
import {
  hasVariants,
  getAvailableVariants,
  getRarityStyles,
  VARIANT_CONFIG,
  getRarityByVariant,
} from "@/utils/subSkillUtils";

interface SkillListViewProps {
  onSkillSelect: (skill: SubSkill) => void;
  selectedSkills: SelectedSubSkill[];
  onRemoveSkill: (skillId: string) => void;
}

export const SkillListView = ({
  onSkillSelect,
  selectedSkills,
  onRemoveSkill,
}: SkillListViewProps) => {
  // バリアントなしスキルが選択済みかチェック
  const isSkillSelected = (
    skill: SubSkill
  ): string | null => {
    const selected = selectedSkills.find(
      (s) => s.baseId === skill.name
    );
    return selected ? selected.id : null;
  };

  // バリアントありスキルグループが選択済みかチェック
  const isVariantGroupSelected = (
    skillGroup: string
  ): string | null => {
    const selected = selectedSkills.find((s) =>
      s.baseId.startsWith(skillGroup)
    );
    return selected ? selected.id : null;
  };

  // 特定のバリアントが選択済みかチェック
  const isSpecificVariantSelected = (
    skillGroup: string,
    variant: Variant
  ): boolean => {
    const baseId = `${skillGroup}${variant}`;
    return selectedSkills.some((s) => s.baseId === baseId);
  };

  // スキルグループ毎にグループ化
  const groupedSkills = subSkillData.reduce(
    (acc, skill) => {
      if (skill.skillGroup && hasVariants(skill)) {
        if (!acc.withVariants[skill.skillGroup]) {
          acc.withVariants[skill.skillGroup] = [];
        }
        acc.withVariants[skill.skillGroup].push(skill);
      } else {
        acc.withoutVariants.push(skill);
      }
      return acc;
    },
    {
      withVariants: {} as Record<string, SubSkill[]>,
      withoutVariants: [] as SubSkill[],
    }
  );

  // バリアントなしスキルの表示用カード
  const renderSkillCard = (skill: SubSkill) => {
    const selectedId = isSkillSelected(skill);
    const isSelected = selectedId !== null;
    const styles = getRarityStyles(skill.rarity);

    return (
      <button
        key={skill.name}
        onClick={() => {
          if (isSelected) {
            onRemoveSkill(selectedId);
          } else {
            onSkillSelect(skill);
          }
        }}
        className={`
          p-2 rounded-lg border-2
          ${
            isSelected
              ? "bg-gray-600 hover:bg-gray-600"
              : `${styles.gradient} ${styles.border} ${styles.hover}`
          }
          transition-all active:scale-95
          text-center
        `}
      >
        <div
          className={`text-xs font-medium text-wrap ${
            isSelected ? "text-white" : "text-gray-800"
          }`}
        >
          {skill.displayName}
        </div>
      </button>
    );
  };

  // バリアントありスキルの表示用カード（グループごと）
  const renderVariantSkillCard = (
    skillGroup: string,
    skills: SubSkill[]
  ) => {
    const config = VARIANT_CONFIG[skillGroup];
    const variants = getAvailableVariants(skillGroup);

    return (
      <button
        key={skillGroup}
        onClick={() => {
          onSkillSelect(skills[0]); // グループの代表スキルを渡す
        }}
        className="
          p-2 rounded-lg border-2
          bg-white border-gray-300
          hover:bg-gray-50 hover:border-gray-400
          transition-all active:scale-95
          text-center relative
        "
      >
        <div className="text-xs font-medium text-wrap mb-1.5 text-gray-800">
          {config.label}
        </div>
        {/* バリアントタグ */}
        <div className="flex gap-1 justify-center flex-wrap">
          {variants.map((variant) => {
            const variantRarity = getRarityByVariant(
              skillGroup,
              variant
            );
            const variantStyles =
              getRarityStyles(variantRarity);
            const isVariantSelected =
              isSpecificVariantSelected(
                skillGroup,
                variant
              );
            return (
              <span
                key={variant}
                className={`
                  ${
                    isVariantSelected
                      ? "bg-gray-600 text-white border-gray-500"
                      : variantStyles.chip
                  }
                  px-1.5 py-0.5 rounded text-[9px] font-semibold
                `}
              >
                {variant}
              </span>
            );
          })}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-bold text-gray-800">
        スキルを選択
      </h3>

      <div className="grid grid-cols-3 gap-2">
        {/* バリアントなしスキル */}
        {groupedSkills.withoutVariants.map((skill) =>
          renderSkillCard(skill)
        )}

        {/* バリアントありスキル */}
        {Object.entries(groupedSkills.withVariants).map(
          ([skillGroup, skills]) =>
            renderVariantSkillCard(skillGroup, skills)
        )}
      </div>
    </div>
  );
};
