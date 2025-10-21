import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import SubSkillSelect from "./SubSkillSelect";
import NatureSelect from "./NatureSelect";

function Search() {
  const [pokemon, setPokemon] = useState("");
  const [subSkill1, setSubSkill1] = useState("");
  const [subSkill2, setSubSkill2] = useState("");
  const [subSkill3, setSubSkill3] = useState("");
  const [nature, setNature] = useState("");

  return (
    <>
      <div className="m-4">
        <div className="flex flex-col	justify-center">
          <div className="flex justify-start mt-4 gap-2">
            <SubSkillSelect
              value={subSkill1}
              onChange={setSubSkill1}
              placeholder="サブスキル1"
            />
            <SubSkillSelect
              value={subSkill2}
              onChange={setSubSkill2}
              placeholder="サブスキル2"
            />
            <SubSkillSelect
              value={subSkill3}
              onChange={setSubSkill3}
              placeholder="サブスキル3"
            />
          </div>
          <div className="mt-4">
            <NatureSelect
              value={nature}
              onChange={setNature}
              placeholder="性格"
            />
          </div>
        </div>
        <div className="flex justify-center my-4">
          <Button className="w-full max-w-xs md:w-48">
            決定
          </Button>
        </div>
        <p>ポケモン: {pokemon}</p>
        <p>サブスキル1: {subSkill1}</p>
        <p>サブスキル2: {subSkill2}</p>
        <p>サブスキル3: {subSkill3}</p>
      </div>
    </>
  );
}

export default Search;
