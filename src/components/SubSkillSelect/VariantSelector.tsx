import { SubSkill } from "@/types/subSkill";
import {
  Variant,
  SelectedSubSkill,
} from "@/types/selectedSubSkill";
import {
  getAvailableVariants,
  getRarityByVariant,
  getRarityStyles,
  VARIANT_CONFIG,
} from "@/utils/subSkillUtils";
import { ChevronLeft } from "lucide-react";

interface VariantSelectorProps {
  skill: SubSkill;
  level: number;
  isEditing: boolean;
  onVariantSelect: (variant: Variant) => void;
  onBack: () => void;
  selectedSkills: SelectedSubSkill[];
  onRemoveSkill: (skillId: string) => void;
}

export const VariantSelector = ({
  skill,
  level,
  isEditing,
  onVariantSelect,
  onBack,
  selectedSkills,
  onRemoveSkill,
}: VariantSelectorProps) => {
  const variants = getAvailableVariants(skill.skillGroup);
  const config = VARIANT_CONFIG[skill.skillGroup];

  // 特定のバリアントが選択済みかチェック
  const isVariantSelected = (
    variant: Variant
  ): string | null => {
    const baseId = `${skill.skillGroup}${variant}`;
    const selected = selectedSkills.find(
      (s) => s.baseId === baseId
    );
    return selected ? selected.id : null;
  };

  return (
    <div className="space-y-2.5">
      {/* 戻るボタン */}
      <button
        onClick={onBack}
        className="
          flex items-center gap-1 text-xs text-gray-600
          hover:text-gray-800 transition-colors
        "
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        スキル一覧に戻る
      </button>

      {/* 見出し */}
      <div>
        <h3 className="text-base font-bold text-gray-800 mb-0.5">
          グレードを選択してください
        </h3>
        <p className="text-xs text-gray-600">
          {config.label}のグレードを選んでください
        </p>
      </div>

      {/* レベル表示 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
        <p className="text-xs text-blue-800 text-center">
          Lv.{level} に{isEditing ? "変更" : "自動設定"}
          されます
        </p>
      </div>

      {/* バリアント選択ボタン */}
      <div
        className={`grid gap-2 ${
          variants.length === 3
            ? "grid-cols-3"
            : "grid-cols-2"
        }`}
      >
        {variants.map((variant) => {
          const variantRarity = getRarityByVariant(
            skill.skillGroup,
            variant
          );
          const styles = getRarityStyles(variantRarity);
          const selectedId = isVariantSelected(variant);
          const isSelected = selectedId !== null;

          return (
            <button
              key={variant}
              onClick={() => {
                if (isSelected) {
                  onRemoveSkill(selectedId);
                } else {
                  onVariantSelect(variant);
                }
              }}
              className={`
                py-4 rounded-lg border-2
                ${
                  isSelected
                    ? "bg-gray-600 border-gray-600 hover:bg-gray-600"
                    : `${styles.gradient} ${styles.border} ${styles.hover}`
                }
                transition-all active:scale-95
              `}
            >
              <div className="text-center">
                <div
                  className={`text-xl font-bold mb-0.5 ${
                    isSelected
                      ? "text-white"
                      : "text-gray-800"
                  }`}
                >
                  {variant}
                </div>
                <div
                  className={`text-[10px] ${
                    isSelected
                      ? "text-gray-200"
                      : "text-gray-600"
                  }`}
                >
                  {variant === "L"
                    ? "Large"
                    : variant === "M"
                    ? "Medium"
                    : "Small"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
