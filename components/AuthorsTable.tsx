"use client";

import { useState } from "react";
import { AuthorsRecord } from "@/lib/schema";
import Lineicons from "@lineiconshq/react-lineicons";
import { StarFatSolid } from "@lineiconshq/free-icons";

interface AuthorsTableProps {
  authors: AuthorsRecord[];
}

const ITEMS_PER_PAGE = 10;

export default function AuthorsTable({ authors }: AuthorsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAuthors = authors.filter((author) =>
    (author.Name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAuthors.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAuthors = filteredAuthors.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="ابحث عن المؤلفين..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pr-10 pl-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">اسم المؤلف</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">إجمالي العوائد</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">التقييم</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAuthors.length > 0 ? (
              paginatedAuthors.map((author) => (
                <tr
                  key={author.id}
                  className="cursor-pointer border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white font-medium">
                    {author.Name || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {"$" + author["Total Revenue"]?.toLocaleString() || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400"><Lineicons icon={StarFatSolid} size={15} className="text-2xl text-yellow-400" /></span>
                        <span className="text-zinc-900 dark:text-white">{author['Rating'] || "—"}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  لم يتم العثور على مؤلفين
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredAuthors.length > 0 ? (
            <>
              {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredAuthors.length)} من {filteredAuthors.length} مؤلف
            </>
          ) : (
            "0 مؤلفين"
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-zinc-50 dark:hover:enabled:bg-zinc-800 transition-colors"
            >
              السابق
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-zinc-50 dark:hover:enabled:bg-zinc-800 transition-colors"
            >
              التالي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
