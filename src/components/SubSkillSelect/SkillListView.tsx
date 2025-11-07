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
  onVariantSelect: (
    skill: SubSkill,
    variant: Variant
  ) => void;
  selectedSkills: SelectedSubSkill[];
  onRemoveSkill: (skillId: string) => void;
}

export const SkillListView = ({
  onSkillSelect,
  onVariantSelect,
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
              ? "bg-muted hover:opacity-80"
              : `${styles.gradient} ${styles.border} ${styles.hover}`
          }
          transition-all active:scale-95
          text-center cursor-pointer
        `}
      >
        <div
          className={`text-xs font-medium text-wrap ${
            isSelected ? "text-foreground" : "text-gray-800"
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
      <div
        key={skillGroup}
        className="
          p-1.5 rounded-lg border-2
          bg-card border-border
          text-center
        "
      >
        <div className="text-xs font-medium break-words mb-1 text-foreground">
          {config.label}
        </div>
        {/* バリアントタグ（クリック可能） */}
        <div className="flex gap-1 justify-center">
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
            const selectedId = isVariantSelected
              ? selectedSkills.find(
                  (s) =>
                    s.baseId === `${skillGroup}${variant}`
                )?.id
              : null;

            return (
              <button
                key={variant}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isVariantSelected && selectedId) {
                    onRemoveSkill(selectedId);
                  } else {
                    onVariantSelect(skills[0], variant);
                  }
                }}
                className={`
                  flex-1
                  ${
                    isVariantSelected
                      ? "bg-muted text-foreground"
                      : variantStyles.chip
                  }
                  px-2 py-1.5 rounded-md text-sm font-bold
                  transition-all active:scale-95
                  cursor-pointer
                  hover:opacity-80 hover:shadow-md
                  border-2
                `}
              >
                {variant}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="text-base font-bold text-foreground">
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
