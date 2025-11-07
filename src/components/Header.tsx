"use client";

import { ThemeToggle } from "./theme-toggle";

function Header() {
  return (
    <>
      <div className="bg-primary h-14 w-full flex items-center justify-between sticky top-0 z-50 border-b border-primary-foreground/10 shadow-sm">
        <p className="text-2xl font-semibold text-primary-foreground pl-4">
          ポケスリ個体値比較
        </p>
        <div className="pr-4">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

export default Header;
