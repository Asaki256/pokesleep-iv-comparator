"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/PokeNameCombobox";
import SubSkillSelect from "./SubSkillSelect";
import NatureSelector from "./nature/NatureSelector";
import { SelectedSubSkill } from "@/types/selectedSubSkill";
import { SelectedNature } from "@/types/nature";
import { pokemonData } from "@/data/pokemonData";
import { kinomiData } from "@/data/kinomiData";

function Search() {
  const [pokemon, setPokemon] = useState("");
  const [selectedSubSkills, setSelectedSubSkills] =
    useState<SelectedSubSkill[]>([]);
  const [nature, setNature] =
    useState<SelectedNature | null>(null);

  // 選択されたポケモンのデータを取得
  const selectedPokemon = pokemonData.find(
    (p) => p.name === pokemon
  );

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

  return (
    <>
      <div className="m-4 max-w-md mx-auto">
        <div>
          {/* ポケモン選択 */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base">ポケモン</h2>
            </div>
            <Combobox
              value={pokemon}
              onChange={setPokemon}
            />
            {/* とくいときのみ表示 */}
            {selectedPokemon && (
              <div className="flex flex-wrap gap-2 mt-2 items-center justify-center">
                {selectedPokemon?.type && (
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${getTokuiStyle(
                      selectedPokemon.type
                    )}`}
                  >
                    {selectedPokemon.type}
                  </span>
                )}
                <div className="text-xs">
                  {kinomiName || ""}
                </div>
                <div className="text-xs px-3 py-1 bg-purple-100 text-purple-800 rounded-md font-medium">
                  {selectedPokemon.mainSkill}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <SubSkillSelect
              onChange={setSelectedSubSkills}
            />
          </div>
          <div className="mt-4">
            <NatureSelector
              value={nature}
              onChange={setNature}
            />
          </div>
          <div className="text-xs mt-4 text-center">
            ※同レベルでの比較を行うため、Lv.60固定で計算します。
          </div>
        </div>
        <div className="flex justify-center my-4">
          <Button className="w-full max-w-xs md:w-48">
            決定
          </Button>
        </div>
        <div className="text-center">
          <p>ポケモン: {pokemon}</p>
          <p>
            性格:{" "}
            {nature
              ? `${nature.name}${
                  nature.up
                    ? ` (▲${nature.up} ▼${nature.down})`
                    : " (補正なし)"
                }`
              : "未選択"}
          </p>
          <p>選択したサブスキル:</p>
          <ul className="list-none">
            {selectedSubSkills.map((skill) => (
              <li key={skill.id}>
                Lv.{skill.level} - {skill.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Search;
