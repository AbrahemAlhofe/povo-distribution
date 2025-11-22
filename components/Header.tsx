"use client";
import Lineicons from "@lineiconshq/react-lineicons";
import { MenuHamburger1Solid, XmarkSolid } from "@lineiconshq/free-icons";
import useStore from "@/lib/store";
export default function Header({ className = "" }: { className?: string }) {
    const isAsideOpen = useStore((state) => state.isAsideOpen);
    const toggleAside = useStore((state) => state.toggleAside);
  return (
    <header className={["top-0 z-10 w-full h-16 bg-white dark:bg-black border-b border-zinc-100 dark:border-zinc-800 flex items-center px-6 justify-between", className, isAsideOpen ? "sticky" : ""].join(" ")}>
      <button onClick={() => toggleAside()} className="cursor-pointer p-3 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-900 dark:hover:bg-zinc-900 transition-colors">
        <Lineicons icon={isAsideOpen ? XmarkSolid : MenuHamburger1Solid} className="text-2xl text-zinc-500" />
      </button>
    </header>
  );
}