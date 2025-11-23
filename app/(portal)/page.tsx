import { getBooks, getTopAuthors, getTopBooks, getDemographicsData, getNotes, type TopAuthor, type TopBook, type DemographicsData } from "../../lib/airtable";
import { calculateDashboardMetrics } from "../../lib/metrics";
import { BooksRecord, NotesRecord } from "../../lib/schema";
import DashboardRow from "../../components/DashboardRow";
import StatCard, { StatItem } from "../../components/StartCard";
import DemographicsCharts from "../../components/DemographicsCharts";
import NotesTable from "../../components/NotesTable";
import { cookies } from "next/headers";
import { Session } from "@/lib/types";

export default async function Home() {
  let books: BooksRecord[] = [];
  let metrics = null;
  let topAuthors: TopAuthor[] = [];
  let topBooks: TopBook[] = [];
  let demographics: DemographicsData | null = null;
  let notes: NotesRecord[] = [];
  let error: string | null = null;
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session");
  const session: Session | null = sessionCookie ? JSON.parse(decodeURIComponent(sessionCookie.value)) : null;
  const clientEmail = session?.email || "";

  try {
    [books, metrics, topAuthors, topBooks, demographics, notes] = await Promise.all([
      getBooks(),
      calculateDashboardMetrics({ clientEmail }),
      getTopAuthors(10),
      getTopBooks(10),
      getDemographicsData(),
      getNotes(10),
    ]);
  } catch (err: any) {
    error = err?.message ?? String(err);
  }

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
    <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-start bg-white dark:bg-black sm:items-start">
      {error ? (
        <div className="w-full rounded-md bg-red-50 p-4 text-red-800">خطأ: {error}</div>
      ) : (
        <>
          {metrics && <DashboardRow session={session} metrics={metrics} />}

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <StatCard title={`أفضل ${topAuthors.length} مؤلفين`} items={authorsItems} />
            <StatCard title={`أفضل ${topBooks.length} كتب`} items={booksItems} />
          </div>

          <DemographicsCharts data={demographics || undefined} />

          <NotesTable notes={notes} />
        </>
      )}
    </main>
  );
}
