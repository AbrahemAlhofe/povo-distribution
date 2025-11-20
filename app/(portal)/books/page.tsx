import { getBooks } from "@/lib/airtable";
import BooksTable from "@/components/BooksTable";

export default async function BooksPage() {
  const books = await getBooks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">أداء الكتب</h1>
      </div>

      {/* <div className="flex gap-4">
        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          كل الفئات
        </button>
        <button className="px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
          كل المنصات
        </button>
      </div> */}

      <BooksTable books={books} />
    </div>
  );
}
