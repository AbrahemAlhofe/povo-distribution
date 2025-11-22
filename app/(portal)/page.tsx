import { getBooks, getTopAuthors, getTopBooks, getDemographicsData, getNotes, type TopAuthor, type TopBook, type DemographicsData } from "../../lib/airtable";
import { calculateDashboardMetrics } from "../../lib/metrics";
import { BooksRecord, NotesRecord } from "../../lib/schema";
import DashboardRow from "../../components/DashboardRow";
import BooksStatsCharts from "../../components/BooksStatsCharts";
import DemographicsCharts from "../../components/DemographicsCharts";
import NotesTable from "../../components/NotesTable";
import { authClient } from "@/auth-client";

export default async function Home() {
  let books: BooksRecord[] = [];
  let metrics = null;
  let topAuthors: TopAuthor[] = [];
  let topBooks: TopBook[] = [];
  let demographics: DemographicsData | null = null;
  let notes: NotesRecord[] = [];
  let error: string | null = null;
  const { data } = await authClient.getSession();

  const clientEmail = data?.user?.email || "";

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

  return (
    <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-start bg-white dark:bg-black sm:items-start">
      {error ? (
        <div className="w-full rounded-md bg-red-50 p-4 text-red-800">خطأ: {error}</div>
      ) : (
        <>
          {metrics && <DashboardRow metrics={metrics} />}

          <BooksStatsCharts topAuthors={topAuthors} topBooks={topBooks} />

          <DemographicsCharts data={demographics || undefined} />

          <NotesTable notes={notes} />
        </>
      )}
    </main>
  );
}
