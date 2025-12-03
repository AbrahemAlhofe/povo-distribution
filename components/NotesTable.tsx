"use client";
import React from "react";
import type { NotesRecord } from "../lib/schema";

interface NotesTableProps {
  notes?: NotesRecord[];
}

export default function NotesTable({ notes = [] }: NotesTableProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full rounded-xl bg-white shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-700 mt-8">
      <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">الملاحظات</h2>
      </div>

      <div className="overflow-x-auto h-50 flex items-center justify-center">
        <table className="w-full hidden">
          <thead className="bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">رقم الملاحظة</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">المحتوى</th>
            </tr>
          </thead>
          <tbody>
            {notes.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                  لا توجد ملاحظات
                </td>
              </tr>
            ) : (
              notes.map((note) => (
                <tr
                  key={note.id}
                  className="border-b border-zinc-100 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-zinc-900 dark:text-zinc-50 max-w-xs truncate">
                      {note["Note ID"] || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md line-clamp-2">
                      {note["Body"] || "—"}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div>قريبا</div>
      </div>

      {notes.length > 0 && (
        <div className="hidden px-6 py-4 border-t border-zinc-200 dark:border-zinc-700 text-center">
          <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            عرض جميع الملاحظات
          </button>
        </div>
      )}
    </div>
  );
}
