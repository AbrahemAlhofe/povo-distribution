"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Lineicons from "@lineiconshq/react-lineicons";
import { Home2Outlined, Books2Solid, Books2Outlined, Home2Solid, BarChartDollarOutlined, BarChartDollarSolid, UserMultiple4Duotone, UserMultiple4Solid } from "@lineiconshq/free-icons";
import useStore from "@/lib/store";

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

export default function Aside() {
  const pathname = usePathname();
  const isOpen = useStore((state) => state.isAsideOpen);

  return (
    <aside className="relative dark:border-zinc-800 flex flex-col gap-2 items-center rounded-lg">
        <div className={['md:w-[25vw] sm:w-[50vw] w-[90vw] h-[80vh] p-5 pt-10 rounded-lg sm:right-5 top-20 md:top-5 md:sticky', 'bg-zinc-950 md:bg-black fixed md:static z-10 flex gap-4 transition-transform duration-300 md:translate-x-0', (isOpen ?"translate-x-[0vw]" : "translate-x-[100em]")].join(" ")}>
          <div className="flex flex-col flex-1">
            <nav className="flex-1">
              <ul className="flex flex-col gap-2 color-zinc-600">
                <NavItem 
                  label="التحليلات العامة" 
                  href="/" 
                  icon={<Lineicons icon={pathname === "/" ? Home2Solid : Home2Outlined} size={24} strokeWidth={1.5} />}
                  active={pathname === "/"}
                />
                <NavItem 
                  label="الكتب" 
                  href="/books" 
                  icon={<Lineicons icon={pathname === "/books" ? Books2Solid : Books2Outlined} size={24} strokeWidth={1.5} />}
                  active={pathname === "/books"}
                />
                <NavItem 
                  label="الإيرادات" 
                  href="/revenues" 
                  icon={<Lineicons icon={pathname === "/revenues" ? BarChartDollarSolid : BarChartDollarOutlined} size={24} strokeWidth={1.5} />}
                  active={pathname === "/revenues"}
                />
                <NavItem 
                  label="المؤلفون" 
                  href="/authors" 
                  icon={<Lineicons icon={pathname === "/authors" ? UserMultiple4Solid : UserMultiple4Duotone} size={24} strokeWidth={1.5} />}
                  active={pathname === "/authors"}
                />
              </ul>
            </nav>
        </div>
      </div>
      <div className="mt-auto pt-8 text-center text-xs text-zinc-400">Povo Studios 2025 ©<br/>جميع الحقوق محفوظة</div>
    </aside>
  );
}
