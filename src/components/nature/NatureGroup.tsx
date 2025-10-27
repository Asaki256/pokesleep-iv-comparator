import {
  NatureGroup as NatureGroupType,
  SelectedNature,
} from "@/types/nature";
import { COLOR_CONFIG } from "@/data/natureData";
import NatureButton from "./NatureButton";

interface NatureGroupProps {
  group: NatureGroupType;
  selectedNature: SelectedNature | null;
  onSelect: (nature: SelectedNature) => void;
}

export default function NatureGroup({
  group,
  selectedNature,
  onSelect,
}: NatureGroupProps) {
  const config = COLOR_CONFIG[group.color];

  return (
    <div className="rounded-xl p-1">
      {/* グループヘッダー */}
      <div className="flex items-center gap-1 mb-1">
        <h3 className={`font-bold text-sm ${config.text}`}>
          {group.name}
          {group.id !== "neutral" && "↑"}
        </h3>
      </div>

      {/* 性格ボタングリッド */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
        {group.natures.map((nature) => (
          <NatureButton
            key={nature.name}
            nature={nature}
            groupColor={group.color}
            isSelected={
              selectedNature?.name === nature.name
            }
            config={config}
            onSelect={() =>
              onSelect({
                ...nature,
                color: group.color,
              })
            }
          />
        ))}
      </div>
    </div>
  );
}
