import React from 'react';
import { Nature, ColorConfig, ColorTheme } from '@/types/nature';

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
        p-1.5 rounded-lg border-2 transition-all flex items-center gap-1.5
        ${
          isSelected
            ? `${config.selected} shadow-md scale-95`
            : `${config.button} active:scale-95`
        }
      `}
      aria-label={nature.name}
      aria-pressed={isSelected}
    >
      <div className="font-medium text-sm text-gray-800 flex-1 text-left">
        {nature.name}
      </div>
      {nature.up ? (
        <div className="flex flex-col gap-0 text-[9px] leading-tight">
          <div className="text-red-600 font-medium">▲{nature.up}</div>
          <div className="text-blue-600 font-medium">▼{nature.down}</div>
        </div>
      ) : (
        <div className="text-[9px] text-gray-500 whitespace-nowrap">
          補正なし
        </div>
      )}
    </button>
  );
}
