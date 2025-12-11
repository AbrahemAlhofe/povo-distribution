import AuthorsTable from "@/components/AuthorsTable";
import { DatabaseClient } from "@/lib/database";
import { DATABASE_CONFIG, AuthorsRecord } from "@/lib/schema";

export default async function AuthorsPage() {
  const authors = await DatabaseClient.getManyRecordsByFormula<AuthorsRecord>(DATABASE_CONFIG.tables.authors.id, '', { pageSize: 10, sort: [{ field: 'total_revenue', direction: 'asc' }] });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">المؤلفون</h1>
      </div>

      {/* <div className="flex gap-4">
        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          كل الجنسيات
        </button>
        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          كل الكتب
        </button>
      </div> */}

      <AuthorsTable authors={authors} />
    </div>
  );
}
