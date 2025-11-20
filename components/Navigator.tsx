"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Lineicons from "@lineiconshq/react-lineicons";
import { Home2Outlined, Books2Solid, Books2Outlined, Home2Solid, BarChartDollarOutlined, BarChartDollarSolid, UserMultiple4Duotone, UserMultiple4Solid, MenuCheesburgerBulk, ChevronDownBulk, ChevronLeftSolid, ChevronLeftOutlined } from "@lineiconshq/free-icons";

const NavItem = ({ label, href, icon, active = false }: { label: string; href: string; icon: React.ReactNode; active?: boolean }) => (
  <li>
    <Link
      href={href}
      className={`cursor-pointer flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" : "text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
      }`}
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </Link>
  </li>
);

export default function Navigator() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <aside className="w-70 min-h-screen border-r border-zinc-100 bg-white dark:bg-black dark:border-zinc-800 p-4 flex flex-row gap-2 relative opacity-95">
      <div className={"sticky z-2 flex gap-4 " + (isOpen ? "" : "hidden")}>
        <div className="stick flex flex-col flex-1 ">
          <nav className="flex-1">
            <ul className="flex flex-col gap-2">
              <NavItem 
                label="التحليلات العامة" 
                href="/" 
                icon={<Lineicons icon={pathname === "/" ? Home2Solid : Home2Outlined} size={24} color="blue" strokeWidth={1.5} />}
                active={pathname === "/"}
              />
              <NavItem 
                label="الكتب" 
                href="/books" 
                icon={<Lineicons icon={pathname === "/books" ? Books2Solid : Books2Outlined} size={24} color="blue" strokeWidth={1.5} />}
                active={pathname === "/books"}
              />
              <NavItem 
                label="الإيرادات" 
                href="/revenues" 
                icon={<Lineicons icon={pathname === "/revenues" ? BarChartDollarSolid : BarChartDollarOutlined} size={24} color="blue" strokeWidth={1.5} />}
                active={pathname === "/revenues"}
              />
              <NavItem 
                label="المؤلفون" 
                href="/authors" 
                icon={<Lineicons icon={pathname === "/authors" ? UserMultiple4Solid : UserMultiple4Duotone} size={24} color="blue" strokeWidth={1.5} />}
                active={pathname === "/authors"}
              />
            </ul>
          </nav>
          <div className="mt-auto pt-8 text-center text-xs text-zinc-400">Povo Studios 2025 ©<br/>جميع الحقوق محفوظة</div>
        </div>
        <div>
          <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
            <Lineicons icon={ChevronLeftOutlined} className="text-2xl text-green-500 transform rotate-180" />
          </button>
        </div>
      </div>
      <div className="absolute top-4 ml-2">
        <button onClick={() => setIsOpen(!isOpen)} className="cursor-pointer p-3 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          <Lineicons icon={ChevronLeftOutlined} className="text-2xl text-green-500" />
        </button>
      </div>
    </aside>
  );
}
