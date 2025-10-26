"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/PokeNameCombobox";
import SubSkillSelect from "./SubSkillSelect";
import NatureSelect from "./NatureSelect";
import { SelectedSubSkill } from "@/types/selectedSubSkill";

function Search() {
  const [pokemon, setPokemon] = useState("");
  const [selectedSubSkills, setSelectedSubSkills] =
    useState<SelectedSubSkill[]>([]);
  const [nature, setNature] = useState("");

  return (
    <>
      <div className="m-4 max-w-md mx-auto">
        <div>
          <div className="flex justify-center flex-wrap gap-4">
            <div>
              <Combobox
                value={pokemon}
                onChange={setPokemon}
              />
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-xs">とくい:</div>
              <div className="text-xs">きのみ:</div>
            </div>
          </div>
          <div className="mt-4">
            <SubSkillSelect
              onChange={setSelectedSubSkills}
            />
          </div>
          <div className="mt-4">
            <NatureSelect
              value={nature}
              onChange={setNature}
              placeholder="性格"
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
