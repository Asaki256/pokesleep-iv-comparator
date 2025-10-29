import { SubSkill } from "@/types/subSkill";
import {
  SelectedSubSkill,
  Variant,
} from "@/types/selectedSubSkill";
import { SkillListView } from "./SkillListView";
import { X } from "lucide-react";
import { getRarityStyles } from "@/utils/subSkillUtils";
import { useEffect } from "react";

interface SkillPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkills: SelectedSubSkill[];
  editingSkill: SelectedSubSkill | null;
  nextLevel: number;
  onSkillSelect: (skill: SubSkill) => void;
  onVariantSelect: (skill: SubSkill, variant: Variant) => void;
  onRemoveSkill: (skillId: string) => void;
}

export const SkillPickerModal = ({
  isOpen,
  onClose,
  selectedSkills,
  editingSkill,
  nextLevel,
  onSkillSelect,
  onVariantSelect,
  onRemoveSkill,
}: SkillPickerModalProps) => {
  // モーダルが開いたときにbodyのスクロールを無効化
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const isEditing = editingSkill !== null;

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div
          className="
            bg-background rounded-t-3xl
            max-h-[80vh] overflow-y-auto
            shadow-2xl
          "
        >
          {/* ハンドル */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* ヘッダー */}
          <div className="px-4 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {isEditing
                  ? "スキルを変更"
                  : "スキルを選択"}
              </h2>
              <button
                onClick={onClose}
                className="
                  p-1.5 rounded-full
                  hover:bg-gray-100
                  transition-colors
                "
                aria-label="閉じる"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 編集モード時の編集中バッジ */}
            {isEditing && editingSkill && (
              <div className="mt-1.5">
                <div
                  className={`
                    inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                    bg-slate-100 border border-slate-300
                  `}
                >
                  <span className="text-xs text-secondary">
                    編集中
                  </span>
                  <span className="text-xs font-semibold text-secondary">
                    {editingSkill.name}
                  </span>
                </div>
              </div>
            )}

            {/* 追加モード時の選択中スキルと次のレベル表示 */}
            {!isEditing && (
              <div className="mt-2 space-y-1.5">
                {/* 選択中スキル（チップ形式） */}
                {selectedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSkills.map((skill, index) => {
                      const styles = getRarityStyles(
                        skill.rarity
                      );
                      return (
                        <div
                          key={skill.id}
                          className={`
                            ${styles.chip}
                            pl-2 pr-1 py-0.5 rounded-full
                            text-xs font-medium
                            flex items-center gap-1
                            min-w-[140px]
                          `}
                        >
                          <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                            Lv.{skill.level} {skill.name}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSkill(skill.id);
                            }}
                            className="
                              text-red-500 hover:text-red-700
                              transition-colors
                              shrink-0
                              p-0.5
                            "
                            aria-label={`${skill.name}を削除`}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* メッセージ */}
                {selectedSkills.length < 5 && (
                  <div className="space-y-0.5">
                    <p className="text-xs text-gray-600">
                      続けて選択できます
                    </p>
                    <p className="text-xs font-medium text-blue-600">
                      次のスキル: Lv.{nextLevel} に自動設定
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* コンテンツ */}
          <div className="px-4 py-3">
            <SkillListView
              onSkillSelect={onSkillSelect}
              onVariantSelect={onVariantSelect}
              selectedSkills={selectedSkills}
              onRemoveSkill={onRemoveSkill}
            />
          </div>
        </div>
      </div>
    </>
  );
};
