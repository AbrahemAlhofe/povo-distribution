"use client";

import { BookRecord } from "@/lib/schema";
import { StarFatSolid } from "@lineiconshq/free-icons";
import Lineicons from "@lineiconshq/react-lineicons";
import Link from "next/link";
import { useState } from "react";

const ITEMS_PER_PAGE = 10;

export default function BooksTable({ books }: { books: BookRecord[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          placeholder="ابحث عن الكتب..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pr-10 pl-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">اسم الكتاب</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">المنصات</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">الإيرادات</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">دقائق الاستماع</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">التقييم</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">معدل الاستماع الكامل</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-zinc-900 dark:text-white">تفاصيل الكتاب</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBooks.length > 0 ? (
              paginatedBooks.map((book) => (
                <tr
                  key={book.id}
                  className="cursor-pointer border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white font-medium">
                    {book.title || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {Array.isArray(book.platform_names)
                      ? book.platform_names.join(", ")
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                    ${book.total_revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-600 dark:text-zinc-400">
                    {Math.round(book.listening_minutes)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400"><Lineicons icon={StarFatSolid} size={15} className="text-2xl text-yellow-400" /></span>
                      <span className="text-zinc-900 dark:text-white">
                        {/* {book.Rate} */}
                        قريبا
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        {/* {Math.round(book["Completion Ratio"] * 100)}% */}
                        قريبا
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-900 dark:text-white">
                    <Link href={`/books/${book.id}`}> تفاصيل الكتاب</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-zinc-500 dark:text-zinc-400">
                  لم يتم العثور على كتب
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {filteredBooks.length > 0 ? (
            <>
              {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, filteredBooks.length)} من {filteredBooks.length} كتاب
            </>
          ) : (
            "0 كتب"
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
