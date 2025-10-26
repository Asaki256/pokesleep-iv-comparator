"use client";

import { useState } from "react";
import { SubSkill } from "@/types/subSkill";
import {
  SelectedSubSkill,
  Variant,
} from "@/types/selectedSubSkill";
import { SkillCard } from "./SubSkillSelect/SkillCard";
import { SkillPickerModal } from "./SubSkillSelect/SkillPickerModal";
import {
  hasVariants,
  getAutoLevel,
  getSkillNameWithVariant,
  getRarityByVariant,
} from "@/utils/subSkillUtils";
import { Plus } from "lucide-react";

type ModalView = "list" | "variant";

interface SubSkillSelectProps {
  onChange?: (skills: SelectedSubSkill[]) => void;
}

const SubSkillSelect = ({
  onChange,
}: SubSkillSelectProps = {}) => {
  const [selectedSkills, setSelectedSkills] = useState<
    SelectedSubSkill[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<
    number | null
  >(null);
  const [currentView, setCurrentView] =
    useState<ModalView>("list");
  const [variantSkill, setVariantSkill] =
    useState<SubSkill | null>(null);

  // スキル追加モードでモーダルを開く
  const openAddMode = () => {
    setEditingIndex(null);
    setCurrentView("list");
    setIsModalOpen(true);
  };

  // スキル編集モードでモーダルを開く
  const openEditMode = (index: number) => {
    setEditingIndex(index);
    setCurrentView("list");
    setIsModalOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingIndex(null);
    setCurrentView("list");
    setVariantSkill(null);
  };

  // スキル選択時の処理
  const handleSkillSelect = (skill: SubSkill) => {
    if (hasVariants(skill)) {
      // バリアントがある場合はバリアント選択画面へ
      setVariantSkill(skill);
      setCurrentView("variant");
    } else {
      // バリアントがない場合は即座に追加
      addOrReplaceSkill(skill, null);
    }
  };

  // バリアント選択時の処理
  const handleVariantSelect = (variant: Variant) => {
    if (variantSkill) {
      addOrReplaceSkill(variantSkill, variant);
    }
  };

  // スキルを追加または置き換え
  const addOrReplaceSkill = (
    skill: SubSkill,
    variant: Variant | null
  ) => {
    const isEditing = editingIndex !== null;

    // baseIdを生成（バリアントありの場合は skillGroup + variant）
    const baseId =
      variant && skill.skillGroup
        ? `${skill.skillGroup}${variant}`
        : skill.name;

    if (isEditing) {
      // 編集モード: 既存のスキルを置き換え
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

      // 5つ到達したら自動でモーダルを閉じる
      if (updatedSkills.length === 5) {
        closeModal();
      } else {
        // スキル一覧に戻る（連続選択可能）
        setCurrentView("list");
        setVariantSkill(null);
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
    const deletingIndex = selectedSkills.findIndex(
      (skill) => skill.id === skillId
    );
    const isDeletingEditingSkill =
      editingIndex !== null &&
      deletingIndex === editingIndex;

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
    if (isModalOpen && editingIndex !== null) {
      closeModal();
    }
  };

  // バリアント選択からスキル一覧に戻る
  const backToList = () => {
    setCurrentView("list");
    setVariantSkill(null);
  };

  // 次のレベルを取得
  const nextLevel =
    editingIndex !== null && selectedSkills[editingIndex]
      ? selectedSkills[editingIndex].level
      : getAutoLevel(selectedSkills.length);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base">サブスキル</h2>
          <span className="bg-secondary text-white text-xs px-1.5 py-0.5 rounded-full">
            {selectedSkills.length}/5
          </span>
        </div>

        {selectedSkills.length > 0 && (
          <button
            onClick={clearAll}
            className="
              text-xs font-medium text-red-600
              hover:text-red-700 transition-colors
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

      {/* スキル追加ボタン */}
      <button
        onClick={openAddMode}
        disabled={selectedSkills.length >= 5}
        className={`
          w-full py-1.5 px-3 rounded-lg border-2 border-dashed
          flex items-center justify-center gap-1.5
          text-sm font-medium transition-all
          ${
            selectedSkills.length >= 5
              ? "border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed"
              : "border-secondary text-secondary bg-blue-50 hover:bg-blue-100 hover:border-slate-400 active:scale-95"
          }
        `}
      >
        {selectedSkills.length < 5 ? (
          <>
            <Plus className="w-4 h-4" />
            スキルを追加 (Lv.
            {getAutoLevel(selectedSkills.length)})
          </>
        ) : (
          <span>スキルをタップして変更</span>
        )}
      </button>

      {/* スキルピッカーモーダル */}
      <SkillPickerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedSkills={selectedSkills}
        editingSkill={
          editingIndex !== null
            ? selectedSkills[editingIndex]
            : null
        }
        nextLevel={nextLevel}
        onSkillSelect={handleSkillSelect}
        onVariantSelect={handleVariantSelect}
        currentView={currentView}
        variantSkill={variantSkill}
        onBackToList={backToList}
        onRemoveSkill={removeSkillById}
      />
    </div>
  );
};

export default SubSkillSelect;
