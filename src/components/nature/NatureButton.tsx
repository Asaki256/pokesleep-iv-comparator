import React from "react";
import { Nature, ColorConfig, ColorTheme } from "@/types/nature";

interface NatureButtonProps {
  nature: Nature;
  groupColor: ColorTheme;
  isSelected: boolean;
  config: ColorConfig;
  onSelect: () => void;
}

export default function NatureButton({
  nature,
  isSelected,
  config,
  onSelect,
}: NatureButtonProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        p-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5 cursor-pointer
        ${
          isSelected
            ? `${config.selected} shadow-md scale-95 dark:!bg-gray-800`
            : `${config.button} active:scale-95 dark:bg-gray-700`
        }
      `}
      aria-label={nature.name}
      aria-pressed={isSelected}
    >
      <div
        className={`font-medium text-sm flex-1 text-left text-foreground dark:text-gray-100 ${
          isSelected ? "dark:!text-white" : ""
        }`}
      >
        {nature.name}
      </div>
      {nature.up ? (
        <div className="flex flex-col gap-0 text-[9px] leading-tight">
          <div
            className={`font-medium text-red-600 dark:text-red-300 ${
              isSelected ? "dark:!text-red-200" : ""
            }`}
          >
            ▲{nature.up}
          </div>
          <div
            className={`font-medium text-blue-600 dark:text-blue-300 ${
              isSelected ? "dark:!text-blue-200" : ""
            }`}
          >
            ▼{nature.down}
          </div>
        </div>
      ) : (
        <div
          className={`text-[9px] whitespace-nowrap text-muted-foreground dark:text-gray-300 ${
            isSelected ? "dark:!text-white" : ""
          }`}
        >
          補正なし
        </div>
      )}
    </button>
  );
}
