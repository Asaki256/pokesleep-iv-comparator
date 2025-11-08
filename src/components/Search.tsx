"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/PokeNameCombobox";
import SubSkillSelect from "./SubSkillSelect";
import LevelSelector from "./LevelSelector";
import NatureSelector from "./nature/NatureSelector";
import CalculatedPokemonInfo from "./CalculatedPokemonInfo";
import ResultTabs from "./ResultTabs";
import HistoryList from "./HistoryList";
import CombinationRanking from "./CombinationRanking";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { SelectedNature } from "@/types/nature";
import { pokemonData } from "@/data/pokemonData";
import { kinomiData } from "@/data/kinomiData";
import { calculatePokemonStatsSimple, CalculationResult } from "@/utils/pokemonCalculator";
import { useCalculationHistory } from "@/hooks/useCalculationHistory";
import { NATURE_GROUPS, getDefaultNature } from "@/data/natureData";

function Search() {
  const [pokemon, setPokemon] = useState("");
  const [level, setLevel] = useState(60);
  const [selectedSubSkills, setSelectedSubSkills] =
    useState<SelectedSubSkill[]>([]);
  const [nature, setNature] =
    useState<SelectedNature | null>(getDefaultNature() as SelectedNature);
  const [calculationResult, setCalculationResult] =
    useState<CalculationResult | null>(null);

  // 表示用のスナップショット（決定ボタン押下時のみ更新）
  const [displaySnapshot, setDisplaySnapshot] = useState<{
    pokemonName: string;
    pokemonNumber: number;
    pokemonType?: string;
    nature?: string;
    level: number;
    subSkills: SelectedSubSkill[];
  } | null>(null);

  // 初期表示用のランキング表示データ（履歴から復元、入力欄には反映しない）
  const [initialDisplayData, setInitialDisplayData] = useState<{
    pokemonInternalName: string;
    natureName?: string;
    level: number;
    subSkills: SelectedSubSkill[];
  } | null>(null);

  const { history, addHistory, deleteHistory, clearHistory, getHistoryById, isLoading } =
    useCalculationHistory();

  // 初回ロード時の履歴復元を追跡
  const hasRestoredFromHistory = useRef(false);

  // 選択されたポケモンのデータを取得（入力欄から）
  const selectedPokemon = pokemonData.find(
    (p) => p.name === pokemon
  );

  // ランキング表示用のポケモン（入力欄 or 初期表示データ）
  const rankingPokemon = selectedPokemon ||
    (initialDisplayData ? pokemonData.find(
      (p) => p.name === initialDisplayData.pokemonInternalName
    ) : null);

  // ランキング表示用の性格とサブスキル
  const rankingNature = pokemon ? nature?.name : initialDisplayData?.natureName;
  const rankingSubSkills = pokemon ? selectedSubSkills : (initialDisplayData?.subSkills || []);

  // きのみの日本語名を取得
  const kinomiName = selectedPokemon
    ? kinomiData.find(
        (k) => k.type === selectedPokemon.kinomiType
      )?.name
    : undefined;

  // とくいのタイプに応じた背景色を取得
  const getTokuiStyle = (type: string | undefined) => {
    if (!type) return "";

    switch (type) {
      case "きのみ":
        return "bg-green-500 text-white";
      case "スキル":
        return "bg-blue-500 text-white";
      case "食材":
        return "bg-orange-400 text-white";
      case "オール":
        return "bg-pink-400 text-white";
      default:
        return "";
    }
  };

  // レベルに応じてサブスキルをフィルタリング
  const filterSubSkillsByLevel = (
    subSkills: SelectedSubSkill[],
    pokemonLevel: number
  ): SelectedSubSkill[] => {
    // レベル範囲に応じた適用個数
    // Lv.1-9: 0個, Lv.10-24: 1個, Lv.25-49: 2個, Lv.50-100: 3個
    let maxSkills = 0;
    if (pokemonLevel >= 50) {
      maxSkills = 3;
    } else if (pokemonLevel >= 25) {
      maxSkills = 2;
    } else if (pokemonLevel >= 10) {
      maxSkills = 1;
    }

    // レベルの低い順にソートして、maxSkills個まで適用
    return subSkills
      .slice()
      .sort((a, b) => a.level - b.level)
      .slice(0, maxSkills);
  };

  // 決定ボタンのハンドラー
  const handleCalculate = () => {
    if (!selectedPokemon) {
      alert("ポケモンを選択してください");
      return;
    }

    // レベルに応じてサブスキルをフィルタリング
    const filteredSubSkills = filterSubSkillsByLevel(selectedSubSkills, level);

    // 計算実行
    const result = calculatePokemonStatsSimple(
      selectedPokemon,
      level,
      nature?.name,
      filteredSubSkills
    );

    setCalculationResult(result);

    // 表示用スナップショットを更新
    const snapshot = {
      pokemonName: selectedPokemon.displayName,
      pokemonNumber: selectedPokemon.number,
      pokemonType: selectedPokemon.type,
      nature: nature
        ? `${nature.name}${
            nature.up ? ` (▲${nature.up} ▼${nature.down})` : " (補正なし)"
          }`
        : undefined,
      level,
      subSkills: selectedSubSkills,
    };
    setDisplaySnapshot(snapshot);

    // 初期表示データをクリア（新しい計算結果を表示するため）
    setInitialDisplayData(null);

    // 履歴に保存
    try {
      addHistory({
        pokemonName: selectedPokemon.displayName,
        pokemonInternalName: selectedPokemon.name,
        pokemonNumber: selectedPokemon.number,
        pokemonType: selectedPokemon.type,
        natureName: nature?.name,
        natureDisplay: snapshot.nature,
        level,
        subSkills: selectedSubSkills,
        calculationResult: result,
      });
    } catch (error) {
      console.error("履歴の保存に失敗しました:", error);
    }
  };

  // 履歴から復元
  const handleRestoreFromHistory = (historyId: string) => {
    const historyItem = getHistoryById(historyId);
    if (!historyItem) {
      return;
    }

    // ポケモン選択を復元
    setPokemon(historyItem.pokemonInternalName);

    // レベルを復元（デフォルトは60）
    setLevel(historyItem.level ?? 60);

    // サブスキルを復元
    setSelectedSubSkills(historyItem.subSkills);

    // 性格を復元
    if (historyItem.natureName) {
      // natureName から SelectedNature を再構築
      let foundNature: SelectedNature | null = null;
      for (const group of NATURE_GROUPS) {
        const nature = group.natures.find(
          (n) => n.name === historyItem.natureName
        );
        if (nature) {
          foundNature = {
            ...nature,
            color: group.color,
          };
          break;
        }
      }
      setNature(foundNature);
    } else {
      setNature(null);
    }

    // 初期表示データをクリア（履歴から復元したため）
    setInitialDisplayData(null);

    // 画面をトップにスクロール
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 初回ロード時に最新の履歴を自動反映（入力欄は空のまま、結果表示のみ）
  useEffect(() => {
    if (!isLoading && history.length > 0 && !calculationResult && !hasRestoredFromHistory.current) {
      hasRestoredFromHistory.current = true;
      const latestHistory = history[0];

      // 履歴から状態を一括復元（バッチ更新を使用）
      queueMicrotask(() => {
        setCalculationResult(latestHistory.calculationResult);
        setDisplaySnapshot({
          pokemonName: latestHistory.pokemonName,
          pokemonNumber: latestHistory.pokemonNumber,
          pokemonType: latestHistory.pokemonType,
          nature: latestHistory.natureDisplay,
          level: latestHistory.level ?? 60,
          subSkills: latestHistory.subSkills,
        });
        setInitialDisplayData({
          pokemonInternalName: latestHistory.pokemonInternalName,
          natureName: latestHistory.natureName,
          level: latestHistory.level ?? 60,
          subSkills: latestHistory.subSkills,
        });
      });
    }
  }, [isLoading, history, calculationResult]);

  return (
    <>
      <div className="px-4 py-6 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto">
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-6 mb-6">
          {/* ポケモン選択 */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-foreground">ポケモン</h2>
            </div>
            <Combobox
              value={pokemon}
              onChange={setPokemon}
            />
            {/* とくいときのみ表示 */}
            {selectedPokemon && (
              <div className="flex flex-wrap gap-2 mt-3 items-center justify-center">
                {selectedPokemon?.type && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${getTokuiStyle(
                      selectedPokemon.type
                    )}`}
                  >
                    {selectedPokemon.type}
                  </span>
                )}
                <div className="text-xs text-foreground">
                  {kinomiName || ""}
                </div>
                <div className="text-xs px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-md font-medium">
                  {selectedPokemon.mainSkill}
                </div>
              </div>
            )}
          </div>
          <div className="mt-5">
            <LevelSelector
              value={level}
              onChange={setLevel}
            />
          </div>
          <div className="mt-5">
            <SubSkillSelect
              value={selectedSubSkills}
              onChange={setSelectedSubSkills}
            />
          </div>
          <div className="mt-5">
            <NatureSelector
              value={nature}
              onChange={setNature}
            />
          </div>
          <div className="flex justify-center mt-6">
            <Button
              className="w-full max-w-xs md:w-48 h-11 text-base font-semibold shadow-md hover:shadow-lg transition-shadow"
              onClick={handleCalculate}
            >
              決定
            </Button>
          </div>
        </div>
        {/* 計算結果の表示（スナップショットを使用） */}
        {calculationResult && displaySnapshot && (
          <div className="mb-4">
            <CalculatedPokemonInfo
              pokemonName={displaySnapshot.pokemonName}
              pokemonNumber={displaySnapshot.pokemonNumber}
              pokemonType={displaySnapshot.pokemonType}
              nature={displaySnapshot.nature}
              level={displaySnapshot.level}
              subSkills={displaySnapshot.subSkills}
              calculationResult={calculationResult}
            />
          </div>
        )}

        {/* タブ切り替え（常に表示） */}
        <div className="mt-6">
          <ResultTabs
            rankingContent={
              rankingPokemon ? (
                <CombinationRanking
                  pokemon={rankingPokemon}
                  currentNature={rankingNature}
                  currentSubSkills={rankingSubSkills}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">ポケモンを選択してください</p>
                </div>
              )
            }
            historyContent={
              <HistoryList
                history={history}
                deleteHistory={deleteHistory}
                clearHistory={clearHistory}
                isLoading={isLoading}
                onRestore={handleRestoreFromHistory}
              />
            }
          />
        </div>
      </div>
    </>
  );
}

export default Search;
