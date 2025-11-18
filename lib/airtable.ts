import Airtable, { FieldSet } from "airtable";
import { BooksRecord, PerformanceRecord, AuthorsRecord, NotesRecord, AIRTABLE_CONFIG, InvoicesRecord } from "./schema";

function getEnv(name: string) {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return v;
}

const AIRTABLE_KEY = getEnv("AIRTABLE_API_KEY");
const AIRTABLE_BASE = getEnv("AIRTABLE_BASE_ID");

const base = new Airtable({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE);

export async function getBooks(): Promise<BooksRecord[]> {
  const all: BooksRecord[] = [];

  return new Promise((resolve, reject) => {
    base(AIRTABLE_CONFIG.tables.books.id)
      .select({ pageSize: 100 })
      .eachPage(
        (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
          all.push(
            ...records.map((r: any) => ({
              id: r.id,
              ...(r.fields || {}),
            } as BooksRecord))
          );
          fetchNextPage();
        },
        (err?: any) => {
          if (err) return reject(err);
          resolve(all);
        }
      );
  });
}

export async function getAuthors(): Promise<AuthorsRecord[]> {
  const all: AuthorsRecord[] = [];

  return new Promise((resolve, reject) => {
    base(AIRTABLE_CONFIG.tables.authors.id)
      .select({ pageSize: 100 })
      .eachPage(
        (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
          all.push(
            ...records.map((r: any) => ({
              id: r.id,
              ...(r.fields || {}),
            } as AuthorsRecord))
          );
          fetchNextPage();
        },
        (err?: any) => {
          if (err) return reject(err);
          resolve(all);
        }
      );
  });
}

export interface TopAuthor {
  id: string;
  name: string;
  bookCount: number;
  totalRevenue: number;
}

export interface TopBook {
  id: string;
  title: string;
  authorName: string;
  totalRevenue: number;
}

/**
 * Get top 10 authors by revenue
 * Note: This requires an Authors field on BooksRecord linking to Writers table
 */
export async function getTopAuthors(limit: number = 10): Promise<TopAuthor[]> {
  try {
    const books = await getBooks();

    // Group books by author and sum revenues
    // Assuming books have an Authors field linking to WritersRecord
    const authorStats: Record<string, { name: string; bookCount: number; totalRevenue: number; id: string }> = {};

    for (const book of books) {
      // Check if book has an Authors field (this may need to be updated based on your schema)
      const authorId = (book as any)['Author'];
      const authorName = (book as any)['Author Name'] as string | undefined || "";
      const revenue = book["Total Revenues"] || 0;

      if (!authorId) continue;

        if (!authorStats[authorId]) {
          authorStats[authorId] = {
            id: authorId,
            name: authorName,
            bookCount: 0,
            totalRevenue: 0,
          };
        }
        authorStats[authorId].totalRevenue += revenue;
        authorStats[authorId].bookCount += 1;
    }

    // Sort by revenue and return top N
    return Object.values(authorStats)
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit)
      .map((author) => ({
        id: author.id,
        name: author.name,
        bookCount: author.bookCount,
        totalRevenue: author.totalRevenue,
      }));
  } catch (error) {
    console.error("Error fetching top authors:", error);
    throw error;
  }
}

/**
 * Get top 10 books by revenue
 */
export async function getTopBooks(limit: number = 10): Promise<TopBook[]> {
  try {
    const books = await getBooks();

    return books
      .map((book) => ({
        id: book.id,
        title: book.Title || "بلا عنوان",
        authorName: (book as any)["Author Name"] || "كاتب غير معروف", // placeholder field
        totalRevenue: book["Total Revenues"] || 0,
      }))
      .filter((b) => b.totalRevenue > 0) // only books with revenue
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, limit);
  } catch (error) {
    console.error("Error fetching top books:", error);
    throw error;
  }
}

export interface DemographicsData {
  genderDistribution: {
    male: number;
    female: number;
  };
  ageDistribution: {
    "18-24": number;
    "25-34": number;
    "35-44": number;
    "45-54"?: number;
    "55+"?: number;
  };
}

/**
 * Get aggregated demographics data from performance records
 */
export async function getDemographicsData(): Promise<DemographicsData> {
  try {
    const base = new Airtable({ apiKey: getEnv("AIRTABLE_API_KEY") }).base(
      getEnv("AIRTABLE_BASE_ID")
    );

    const all: PerformanceRecord[] = [];

    return new Promise((resolve, reject) => {
      base(AIRTABLE_CONFIG.tables.performanceRecords.id)
        .select({ pageSize: 100 })
        .eachPage(
          (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
            all.push(
              ...records.map((r: any) => ({
                id: r.id,
                ...(r.fields || {}),
              } as PerformanceRecord))
            );
            fetchNextPage();
          },
          (err?: any) => {
            if (err) return reject(err);

            // get the last performance record for each book
            const latestRecordsMap: Record<string, PerformanceRecord> = {};
            for (const record of all) {
              const bookId = record.Book;
              if (!bookId) continue;
                const existing = latestRecordsMap[bookId];
                if (!existing || new Date(record["Record Date"]) > new Date(existing["Record Date"])) {
                  latestRecordsMap[bookId] = record;
                }
            }

            // Aggregate demographics
            let totalMale = 0;
            let totalFemale = 0;
            let total18_24 = 0;
            let total25_34 = 0;
            let total35_44 = 0;
            let count = 0;
            for (const record of Object.values(latestRecordsMap)) {
              const maleShare = record["Male Share"] || 0;
              const femaleShare = record["Female Share"] || 0;
                const share18_24 = record["( 18 - 24 ) Share"] || 0;
                const share25_34 = record["( 25 - 34 ) Share"] || 0;
                const share35_44 = record["( 35 - 44 ) Share"] || 0;
                totalMale += maleShare;
                totalFemale += femaleShare;
                total18_24 += share18_24;
                total25_34 += share25_34;
                total35_44 += share35_44;
                count += 1;
            }

            console.log(totalMale)

            const demographics: DemographicsData = {
              genderDistribution: {
                male: Math.round((totalMale / count) * 100),
                female: Math.round((totalFemale / count) * 100),
                },
                ageDistribution: {
                "18-24": Math.round((total18_24 / count) * 100),
                "25-34": Math.round((total25_34 / count) * 100),
                "35-44": Math.round((total35_44 / count) * 100),
              },
            };

            resolve(demographics);
          }
        );
    });
  } catch (error) {
    console.error("Error fetching demographics data:", error);
    throw error;
  }
}

export interface RevenueMetrics {
  totalRevenue: number;
  totalPaidRevenue: number;
  totalUnpaidRevenue: number;
}

/**
 * Get revenue metrics from invoices
 */
export async function getRevenueMetrics(): Promise<RevenueMetrics> {
  try {
    const base = new Airtable({ apiKey: getEnv("AIRTABLE_API_KEY") }).base(
      getEnv("AIRTABLE_BASE_ID")
    );

    const all: InvoicesRecord[] = [];

    return new Promise((resolve, reject) => {
      base(AIRTABLE_CONFIG.tables.invoices.id)
        .select({ pageSize: 100 })
        .eachPage(
          (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
            all.push(
              ...records.map((r: any) => ({
                id: r.id,
                ...(r.fields || {}),
              }))
            );
            fetchNextPage();
          },
          (err?: any) => {
            if (err) return reject(err);

            let totalRevenue = 0;
            let totalPaidRevenue = 0;
            let totalUnpaidRevenue = 0;

            for (const invoice of all) {
              const amount = invoice['Invoice Amount'] || 0;
              const isPaid = invoice['Is Paid'] || "";

              totalRevenue += amount;
              if (isPaid) {
                totalPaidRevenue += amount;
              } else {
                totalUnpaidRevenue += amount;
              }
            }

            resolve({
              totalRevenue,
              totalPaidRevenue,
              totalUnpaidRevenue,
            });
          }
        );
    });
  } catch (error) {
    console.error("Error fetching revenue metrics:", error);
    throw error;
  }
}

/**
 * Get recent notes
 */
export async function getNotes(limit: number = 10): Promise<NotesRecord[]> {
  const all: NotesRecord[] = [];

  return new Promise((resolve, reject) => {
    base(AIRTABLE_CONFIG.tables.notes.id)
      .select({ 
        pageSize: 100,
        sort: [{ field: "Note ID", direction: "desc" }]
      })
      .eachPage(
        (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
          all.push(
            ...records.map((r: any) => ({
              id: r.id,
              ...(r.fields || {}),
            } as NotesRecord))
          );
          fetchNextPage();
        },
        (err?: any) => {
          if (err) return reject(err);
          resolve(all.slice(0, limit));
        }
      );
  });
}

/**
 * Get invoices
 */
export async function getInvoices(limit: number = 20): Promise<InvoicesRecord[]> {
  const all: InvoicesRecord[] = [];

  return new Promise((resolve, reject) => {
    base(AIRTABLE_CONFIG.tables.invoices.id)
      .select({
        pageSize: 100,
        sort: [{ field: "Payment Date", direction: "desc" }],
      })
      .eachPage(
        (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
          all.push(
            ...records.map((r: any) => ({
              id: r.id,
              ...(r.fields || {}),
            } as InvoicesRecord))
          );
          fetchNextPage();
        },
        (err?: any) => {
          if (err) return reject(err);
          resolve(all.slice(0, limit));
        }
      );
  });
}
