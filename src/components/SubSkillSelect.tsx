"use client";

import { useState, useEffect } from "react";
import { SubSkill } from "@/types/subSkill";
import {
  SelectedSubSkill,
  Variant,
} from "@/types/selectedSubSkill";
import { SkillCard } from "./SubSkillSelect/SkillCard";
import { SkillPickerModal } from "./SubSkillSelect/SkillPickerModal";
import {
  getAutoLevel,
  getSkillNameWithVariant,
  getRarityByVariant,
} from "@/utils/subSkillUtils";
import { Plus } from "lucide-react";

interface SubSkillSelectProps {
  value?: SelectedSubSkill[];
  onChange?: (skills: SelectedSubSkill[]) => void;
}

const SubSkillSelect = ({
  value,
  onChange,
}: SubSkillSelectProps = {}) => {
  const [selectedSkills, setSelectedSkills] = useState<
    SelectedSubSkill[]
  >(value || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState<
    string | null
  >(null);

  // 外部からのvalue変更を反映
  useEffect(() => {
    if (value !== undefined) {
      setSelectedSkills(value);
    }
  }, [value]);

  // スキル追加モードでモーダルを開く
  const openAddMode = () => {
    setEditingSkillId(null);
    setIsModalOpen(true);
  };

  // スキル編集モードでモーダルを開く
  const openEditMode = (index: number) => {
    setEditingSkillId(selectedSkills[index].id);
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingSkillId(null);
  };

  // スキル選択時の処理（バリアントなしスキル用）
  const handleSkillSelect = (skill: SubSkill) => {
    // バリアントがない場合は即座に追加
    addOrReplaceSkill(skill, null);
  };

  // バリアント選択時の処理
  const handleVariantSelect = (skill: SubSkill, variant: Variant) => {
    addOrReplaceSkill(skill, variant);
  };

  // スキルを追加または置き換え
  const addOrReplaceSkill = (
    skill: SubSkill,
    variant: Variant | null
  ) => {
    const isEditing = editingSkillId !== null;

    // baseIdを生成（バリアントありの場合は skillGroup + variant）
    const baseId =
      variant && skill.skillGroup
        ? `${skill.skillGroup}${variant}`
        : skill.name;

    if (isEditing) {
      // 編集モード: 既存のスキルを置き換え
      const editingIndex = selectedSkills.findIndex(
        (s) => s.id === editingSkillId
      );

      // 編集対象が見つからない場合（削除された場合など）
      if (editingIndex === -1) {
        closeModal();
        return;
      }

      const updatedSkills = [...selectedSkills];
      const currentSkill = updatedSkills[editingIndex];
      const rarity = variant
        ? getRarityByVariant(skill.skillGroup, variant)
        : skill.rarity;

      updatedSkills[editingIndex] = {
        id: currentSkill.id, // IDは保持
        baseId,
        name: getSkillNameWithVariant(
          skill.displayName,
          variant
        ),
        variant,
        level: currentSkill.level, // レベルも保持
        rarity,
      };

      setSelectedSkills(updatedSkills);
      onChange?.(updatedSkills);
      closeModal(); // 編集モードは即座に閉じる
    } else {
      // 追加モード: 重複チェック
      const existingSkill = selectedSkills.find(
        (s) => s.baseId === baseId
      );
      if (existingSkill) {
        // すでに選択済みの場合は何もしない
        return;
      }

      const newSkill: SelectedSubSkill = {
        id: `${baseId}-${Date.now()}`,
        baseId,
        name: getSkillNameWithVariant(
          skill.displayName,
          variant
        ),
        variant,
        level: getAutoLevel(selectedSkills.length),
        rarity: variant
          ? getRarityByVariant(skill.skillGroup, variant)
          : skill.rarity,
      };

      const updatedSkills = [...selectedSkills, newSkill];
      setSelectedSkills(updatedSkills);
      onChange?.(updatedSkills);

      // 3つ到達したら自動でモーダルを閉じる
      if (updatedSkills.length === 3) {
        closeModal();
      }
    }
  };

  // スキル削除（イベントありバージョン）
  const removeSkill = (
    skillId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation(); // カード編集を防止
    removeSkillById(skillId);
  };

  // スキル削除（イベントなしバージョン）
  const removeSkillById = (skillId: string) => {
    // 削除するスキルが編集中のものかチェック
    const isDeletingEditingSkill =
      editingSkillId !== null && skillId === editingSkillId;

    const updatedSkills = selectedSkills
      .filter((skill) => skill.id !== skillId)
      .map((skill, index) => ({
        ...skill,
        level: getAutoLevel(index), // レベル再割り当て
      }));
    setSelectedSkills(updatedSkills);
    onChange?.(updatedSkills);

    // 編集中のスキルを削除した場合、モーダルを閉じる
    if (isDeletingEditingSkill) {
      closeModal();
    }
  };

  // 全削除
  const clearAll = () => {
    setSelectedSkills([]);
    onChange?.([]);
    // 編集モードの場合はモーダルを閉じる
    if (isModalOpen && editingSkillId !== null) {
      closeModal();
    }
  };

  // 編集中のスキルを取得
  const editingSkill = editingSkillId
    ? selectedSkills.find((s) => s.id === editingSkillId) || null
    : null;

  // 次のレベルを取得
  const nextLevel = editingSkill
    ? editingSkill.level
    : getAutoLevel(selectedSkills.length);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base">サブスキル</h2>
          <span className="bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedSkills.length}/3
          </span>
        </div>

        {selectedSkills.length > 0 && (
          <button
            onClick={clearAll}
            className="
              text-xs font-medium text-red-600
              hover:text-red-700 transition-colors
              cursor-pointer
            "
          >
            クリア
          </button>
        )}
      </div>

      {/* 選択済みスキル表示エリア */}
      {selectedSkills.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {selectedSkills.map((skill, index) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onEdit={() => openEditMode(index)}
              onRemove={(e) => removeSkill(skill.id, e)}
            />
          ))}
        </div>
      )}

      {/* スキル追加ボタン - スキルが3つ未満の場合のみ表示 */}
      {selectedSkills.length < 3 && (
        <button
          onClick={openAddMode}
          className="
            w-full py-1.5 px-3 rounded-lg border-2 border-dashed
            flex items-center justify-center gap-1.5
            text-sm font-medium transition-all
            border-secondary text-secondary bg-blue-50/30 dark:bg-blue-900/20 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-slate-400 dark:hover:border-slate-600 active:scale-95
            cursor-pointer
          "
        >
          <Plus className="w-4 h-4" />
          スキルを追加 (Lv.
          {getAutoLevel(selectedSkills.length)})
        </button>
      )}

      {/* スキルピッカーモーダル */}
      <SkillPickerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedSkills={selectedSkills}
        editingSkill={editingSkill}
        nextLevel={nextLevel}
        onSkillSelect={handleSkillSelect}
        onVariantSelect={handleVariantSelect}
        onRemoveSkill={removeSkillById}
      />
    </div>
  );
};

export default SubSkillSelect;
