import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

type SharedHeaderProps = {
  showSubnav?: boolean;
  subnavContent?: ReactNode;
};

export function SharedHeader({ showSubnav, subnavContent }: SharedHeaderProps) {
  return (
    <header>
      {/* Announcement bar */}
      <div className="bg-[#0f2a3d] text-white text-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-2.5">
          <div className="flex items-center gap-3">
            <span className="rounded bg-white px-2 py-0.5 text-xs font-semibold text-[#0f2a3d]">
              Premium
            </span>
            <span className="hidden sm:inline">
              Discover our premium letterpress & foil atelier line
            </span>
            <a href="#" className="underline underline-offset-2 hover:opacity-80">
              Visit Allure &rarr;
            </a>
          </div>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <Link to="/" className="hover:opacity-80">
              Impressions Home
            </Link>
            <a href="#" className="hover:opacity-80">
              For vendors
            </a>
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5">
          <nav className="hidden items-center gap-8 text-sm lg:flex">
            <Link to="/shop" className="flex items-center gap-1 hover:opacity-70">
              Shop <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <Link to="/customize" className="flex items-center gap-1 hover:opacity-70">
              Customize <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <Link to="/" className="hover:opacity-70">
              Home
            </Link>
          </nav>
          <Link to="/" className="font-serif text-3xl font-medium tracking-[0.2em]">
            IMPRESSIONS
          </Link>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:opacity-70" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <button className="p-2 hover:opacity-70" aria-label="Cart">
              <ShoppingBag className="h-5 w-5" />
            </button>
            <button className="hidden rounded-full border border-foreground px-4 py-2 text-sm transition-[transform,color,background-color] duration-150 active:scale-[0.97] sm:inline-flex hover:bg-foreground hover:text-background">
              Log in
            </button>
            <button className="rounded-full bg-foreground px-4 py-2 text-sm text-background transition-[transform,opacity] duration-150 hover:opacity-90 active:scale-[0.97]">
              Get started
            </button>
          </div>
        </div>

        {/* Sub-nav */}
        {showSubnav && subnavContent && (
          <div className="border-t border-border">
            <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-8 overflow-x-auto px-6 py-4 text-sm">
              {subnavContent}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
