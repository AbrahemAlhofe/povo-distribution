import Image from "next/image";
import { getBooks, getTopAuthors, getTopBooks, getDemographicsData, getNotes, type TopAuthor, type TopBook, type DemographicsData } from "../../lib/airtable";
import { calculateDashboardMetrics } from "../../lib/metrics";
import { BooksRecord, NotesRecord } from "../../lib/schema";
import DashboardRow from "../../components/DashboardRow";
import BooksStatsCharts from "../../components/BooksStatsCharts";
import DemographicsCharts from "../../components/DemographicsCharts";
import NotesTable from "../../components/NotesTable";

export default async function Home() {
  let books: BooksRecord[] = [];
  let metrics = null;
  let topAuthors: TopAuthor[] = [];
  let topBooks: TopBook[] = [];
  let demographics: DemographicsData | null = null;
  let notes: NotesRecord[] = [];
  let error: string | null = null;

  try {
    [books, metrics, topAuthors, topBooks, demographics, notes] = await Promise.all([
      getBooks(),
      calculateDashboardMetrics(),
      getTopAuthors(10),
      getTopBooks(10),
      getDemographicsData(),
      getNotes(10),
    ]);
  } catch (err: any) {
    error = err?.message ?? String(err);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-start py-16 px-6 bg-white dark:bg-black sm:items-start">
        {error ? (
          <div className="w-full rounded-md bg-red-50 p-4 text-red-800">خطأ: {error}</div>
        ) : (
          <>
            {/* Dashboard Indicators + single chart window */}
            {metrics && <DashboardRow metrics={metrics} />}

            {/* Book stats charts (top authors, top books) */}
            <BooksStatsCharts topAuthors={topAuthors} topBooks={topBooks} />

            {/* Demographics charts (gender and age distribution) */}
            <DemographicsCharts data={demographics || undefined} />

            {/* Notes table */}
            <NotesTable notes={notes} />
          </>
        )}
      </main>
    </div>
  );
}
