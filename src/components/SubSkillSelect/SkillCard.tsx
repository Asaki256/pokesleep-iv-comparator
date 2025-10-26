import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { getRarityStyles } from "@/utils/subSkillUtils";
import { X } from "lucide-react";

interface SkillCardProps {
  skill: SelectedSubSkill;
  onEdit: () => void;
  onRemove: (e: React.MouseEvent) => void;
}

export const SkillCard = ({
  skill,
  onEdit,
  onRemove,
}: SkillCardProps) => {
  const styles = getRarityStyles(skill.rarity);

  return (
    <div
      className={`
        relative rounded-lg border-2
        ${styles.gradient} ${styles.border}
        transition-all
        overflow-hidden
      `}
    >
      {/* クリック可能なエリア（編集用） */}
      <div
        onClick={onEdit}
        className={`
          flex items-center gap-1.5 px-2 py-1
          ${styles.hover}
          cursor-pointer
          transition-all active:scale-[0.98]
        `}
      >
        {/* レベルバッジ（左端） */}
        <div
          className="
            text-secondary text-xs
            rounded-full w-8 h-5
            flex items-center justify-center
            shrink-0
          "
        >
          Lv.{skill.level}
        </div>

        {/* スキル名（中央、拡大） */}
        <div className="text-xs font-medium text-gray-800 flex-1 min-w-0">
          <div className="truncate">{skill.name}</div>
        </div>

        {/* 削除ボタン（右端） */}
        <button
          onClick={onRemove}
          className="
            text-red-500 hover:text-red-600
            rounded-full w-5 h-5
            flex items-center justify-center
            transition-colors
            active:scale-90
            shrink-0
            cursor-pointer
          "
          aria-label="削除"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
