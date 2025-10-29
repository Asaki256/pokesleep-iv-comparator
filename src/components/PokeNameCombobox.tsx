"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { pokemonData } from "@/data/pokemonData";

const pokemonList = pokemonData.map((pokemon) => ({
  value: pokemon.name,
  label: pokemon.displayName,
}));

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function Combobox({ value, onChange }: Props) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? pokemonList.find(
                (framework) => framework.value === value
              )?.label
            : "ポケモン名を選択"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="ポケモン名を検索"
            className="h-9"
          />
          <CommandList>
            <CommandEmpty>
              一致するポケモンがありません。
            </CommandEmpty>
            <CommandGroup>
              {pokemonList.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.label}
                  onSelect={(currentValue) => {
                    const selectedFramework =
                      pokemonList.find(
                        (f) => f.label === currentValue
                      );
                    onChange(
                      selectedFramework?.value === value
                        ? ""
                        : selectedFramework?.value || ""
                    );
                    setOpen(false);
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
