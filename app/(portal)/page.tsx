import { DatabaseClient } from "@/lib/database";
import { calculateDashboardMetrics } from "../../lib/metrics";
import { DATABASE_CONFIG, AuthorsRecord, BookRecord, NotesRecord } from "../../lib/schema";
import DashboardRow from "../../components/DashboardRow";
import StatCard, { StatItem } from "../../components/StartCard";
import DemographicsCharts from "../../components/DemographicsCharts";
import NotesTable from "../../components/NotesTable";
import { cookies } from "next/headers";
import { Session } from "@/lib/types";

export default async function Home() {
  let books: BookRecord[] = [];
  let metrics = null;
  let topAuthors: StatItem[] = [];
  let topBooks: StatItem[] = [];
  let notes: NotesRecord[] = [];
  let error: string | null = null;
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session");
  const session: Session | null = sessionCookie ? JSON.parse(decodeURIComponent(sessionCookie.value)) : null;
  const clientEmail = session?.email || "";

  try {
    [books, metrics, notes] = await Promise.all([
      DatabaseClient.getManyRecords<BookRecord>(DATABASE_CONFIG.tables.books.id),
      calculateDashboardMetrics({ clientEmail, days: 100 }),
      DatabaseClient.getManyRecords<NotesRecord>(DATABASE_CONFIG.tables.notes.id, { maxRecords: 10 }),
    ]);
  } catch (err: any) {
    console.error("Error fetching initial data:", err);
    error = err?.message ?? String(err);
  }

  console.log("Books fetched:", books);

  try {
    const [authorsRecords, booksRecords] = await Promise.all([
      DatabaseClient.getManyRecordsByFormula<AuthorsRecord>(DATABASE_CONFIG.tables.authors.id, '', { maxRecords: 5, sort: [{ field: 'total_revenue', direction: 'desc' }] }),
      DatabaseClient.getManyRecordsByFormula<BookRecord>(DATABASE_CONFIG.tables.books.id, '', { maxRecords: 5, sort: [{ field: 'total_revenue', direction: 'desc' }] }),
    ]);

    topAuthors = authorsRecords.map((author, index) => ({
      id: author.id,
      title: author["Name"] || "Unknown Author",
      amount: author.total_revenue || 0,
      rank: index + 1,
    }));

    topBooks = booksRecords.map((book, index) => ({
      id: book.id,
      title: book["title"] || "Unknown Book",
      amount: book.total_revenue || 0,
      rank: index + 1,
    }));
  } catch (err: any) {
    console.error("Error fetching top authors or books:", err);
  }

  return (
    <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-start bg-white dark:bg-black sm:items-start">
      {error ? (
        <div className="w-full rounded-md bg-red-50 p-4 text-red-800">خطأ: {error}</div>
      ) : (
        <>
          {metrics && <DashboardRow session={session} metrics={metrics} />}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <StatCard title={`أفضل ${topAuthors.length} مؤلفين`} items={topAuthors} />
            <StatCard title={`أفضل ${topBooks.length} كتب`} items={topBooks} />
          </div>

          <DemographicsCharts data={undefined} />

          <NotesTable notes={notes} />
        </>
      )}
    </main>
  );
}
