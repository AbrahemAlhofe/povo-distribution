"use client";
import React from "react";
import type { TopAuthor, TopBook } from "../lib/airtable";

interface StatItem {
  id: string;
  title: string;
  subtitle?: string;
  amount: number;
  rank: number;
}

function StatCard({ title, items }: { title: string; items: StatItem[] }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
        <div className="text-sm text-zinc-400">&nbsp;</div>
      </div>

      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-4 rounded-md bg-zinc-50 dark:bg-zinc-800 p-3 border border-zinc-100 dark:border-zinc-700">
            <div className="w-10 h-8 flex items-center justify-center rounded-full bg-zinc-200 text-sm text-zinc-700 dark:bg-zinc-700 dark:text-zinc-100">{it.rank}</div>
            <div className="flex flex-wrap gap-2 flex-1 justify-between items-center">
              <div className="min-w-40 sm:min-w-25">
                <div className="text-sm font-medium text-orange-500">{it.title}</div>
                {it.subtitle && <div className="text-xs text-zinc-500 dark:text-zinc-400">{it.subtitle}</div>}
              </div>
              <div className="text-sm text-zinc-700 dark:text-zinc-200">${it.amount.toFixed(2)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface BooksStatsChartsProps {
  topAuthors?: TopAuthor[];
  topBooks?: TopBook[];
}

export default function BooksStatsCharts({ topAuthors = [], topBooks = [] }: BooksStatsChartsProps) {
  // Transform TopAuthor to StatItem
  const authorsItems: StatItem[] = topAuthors.map((author, index) => ({
    id: author.id,
    title: author.name,
    subtitle: author.bookCount == 2 ? "كتابان" : author.bookCount == 1 ? "كتاب واحد" : `${author.bookCount} كتب`,
    amount: author.totalRevenue,
    rank: index + 1,
  }));

  // Transform TopBook to StatItem
  const booksItems: StatItem[] = topBooks.map((book, index) => ({
    id: book.id,
    title: book.title,
    subtitle: book.authorName,
    amount: book.totalRevenue,
    rank: index + 1,
  }));

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
      <StatCard title={`أفضل ${topAuthors.length} مؤلفين`} items={authorsItems} />
      <StatCard title={`أفضل ${topBooks.length} كتب`} items={booksItems} />
    </div>
  );
}
