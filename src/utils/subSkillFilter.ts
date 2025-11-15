import { SelectedSubSkill } from "@/types/selectedSubSkill";

/**
 * レベルに応じて適用されるサブスキルをフィルタリング
 * - Lv.1～9: サブスキルなし
 * - Lv.10～24: 1つ目のみ
 * - Lv.25～49: 1つ目と2つ目
 * - Lv.50～100: 3つすべて
 */
export const filterSubSkillsByLevel = (
  subSkills: SelectedSubSkill[],
  level: number,
): SelectedSubSkill[] => {
  if (level < 10) {
    return [];
  }
  if (level < 25) {
    return subSkills.slice(0, 1);
  }
  if (level < 50) {
    return subSkills.slice(0, 2);
  }
  return subSkills; // Lv.50以上は全て適用
};

/**
 * レベルによって適用されるサブスキルの数を返す
 */
export const getApplicableSubSkillCount = (level: number): number => {
  if (level < 10) return 0;
  if (level < 25) return 1;
  if (level < 50) return 2;
  return 3;
};
