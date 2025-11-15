"use client";

import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";

function Header() {
  return (
    <>
      <div className="bg-primary h-14 w-full flex items-center justify-between sticky top-0 z-50 border-b border-primary-foreground/10 shadow-sm">
        <div className="flex items-center gap-2 pl-4">
          <Image
            src="/icon-512.png"
            alt="Master Ball"
            width={28}
            height={28}
            className="w-7 h-7"
          />
          <p className="text-2xl font-semibold text-primary-foreground">
            ポケスリ個体値比較
          </p>
        </div>
        <div className="pr-4">
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}

export default Header;
