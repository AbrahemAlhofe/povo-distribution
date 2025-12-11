import { BookRecord, PerformanceRecord, DATABASE_CONFIG } from "./schema";
import Airtable, { FieldSet } from "airtable";
import { DatabaseClient } from "./database";

/**
 * Fetch all performance records to calculate dashboard metrics
 */
async function getAllPerformanceRecords(clientEmail: string): Promise<PerformanceRecord[]> {
  const all: PerformanceRecord[] = [];

  return DatabaseClient.getManyRecordsByFormula<PerformanceRecord>(
    DATABASE_CONFIG.tables.performanceRecords.id,
    `({Client Email} = '${clientEmail}')`,
    { pageSize: 100 }
  );
}

/**
 * Fetch all books
 */
async function getAllBooks(clientEmail: string): Promise<BookRecord[]> {
  const all: BookRecord[] = [];

  return DatabaseClient.getManyRecordsByFormula<BookRecord>(
    DATABASE_CONFIG.tables.books.id,
    `({Client Email} = '${clientEmail}')`,
    { pageSize: 100 }
  );
}

export interface DashboardMetrics {
  totalRevenues: number;
  totalListeningMinutes: number;
  uploadedBooksCount: number;
  averageRating: number;
  revenuesChange: number; // percentage
  listeningMinutesChange: number; // percentage
  uploadedBooksChange: number; // percentage
  ratingChange: number; // percentage
  labels: string[];
  revenuesSeries: number[];
  listeningMinutesSeries: number[];
  uploadedBooksSeries: number[];
  ratingSeries: number[];
}

/**
 * Calculate percentage change between two values
 */
function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 0;
  return parseFloat((((current - previous) / previous) * 100).toFixed(2));
}

/**
 * Calculate dashboard metrics from Airtable data
 */
export async function calculateDashboardMetrics({ clientEmail, days }: { clientEmail: string, days: number }): Promise<DashboardMetrics> {
  try {
    const [books, performances] = await Promise.all([
      getAllBooks(clientEmail),
      getAllPerformanceRecords(clientEmail)
    ]);

    // Current period metrics
    const currentRevenues = performances.reduce((sum, p) => sum + (p.Revenue || 0), 0);
    const currentListeningMinutes = performances.reduce(
      (sum, p) => sum + (p["Total Listening Minutes"] || 0),
      0
    );
    const currentUploadedBooksCount = books.filter((b) => b["is_active"]).length;

    // Calculate average rating from current period
    const validRatings = performances.filter((p) => p["5-star Rate"] && p["5-star Rate"] > 0);
    const currentAverageRating =
      validRatings.length > 0
        ? validRatings.reduce((sum, p) => sum + p["5-star Rate"], 0) / validRatings.length
        : 0;

    // Previous period metrics (30 days ago)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const previousPerformances = performances.filter((p) => {
      if (!p["Record Date"]) return false;
      const recordDate = new Date(p["Record Date"]);
      return recordDate < thirtyDaysAgo;
    });

    const previousRevenues = previousPerformances.reduce((sum, p) => sum + (p.Revenue || 0), 0);
    const previousListeningMinutes = previousPerformances.reduce(
      (sum, p) => sum + (p["Total Listening Minutes"] || 0),
      0
    );

    // sort by date, and get the last 30 days uploaded books
    const previousUploadedBooksCount = books.filter((b) => {
      if (!b["upload_date"]) return false;
      const uploadDate = new Date(b["upload_date"]);
      return uploadDate < thirtyDaysAgo && b["is_active"];
    }).length;

    // Calculate average rating from previous period
    const previousValidRatings = previousPerformances.filter(
      (p) => p["5-star Rate"] && p["5-star Rate"] > 0
    );
    const previousAverageRating =
      previousValidRatings.length > 0
        ? previousValidRatings.reduce((sum, p) => sum + p["5-star Rate"], 0) /
          previousValidRatings.length
        : currentAverageRating;

    // Build time series for the last N days (including today)
    const labels: string[] = [];
    const revenuesSeries: number[] = [];
    const listeningMinutesSeries: number[] = [];
    const uploadedBooksSeries: number[] = [];
    const ratingSeries: number[] = [];

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - days);

    const dateKeys: string[] = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      const label = d.toUTCString().split(',')[1].slice(0, -17);
      labels.push(label);
      dateKeys.push(d.toISOString().slice(0, 10)); // YYYY-MM-DD
    }

    const toDateKey = (v?: string | number | Date) => {
      if (!v) return null;
      const d = new Date(v as any);
      if (isNaN(d.getTime())) return null;
      return d.toISOString().slice(0, 10);
    };

    for (const key of dateKeys) {
      const dayPerformances = performances.filter((p) => toDateKey(p["Record Date"]) === key);
      const dayRevenue = dayPerformances.reduce((s, p) => s + (p.Revenue || 0), 0);
      const dayListening = dayPerformances.reduce((s, p) => s + (p["Total Listening Minutes"] || 0), 0);
      const dayRatings = dayPerformances.filter((p) => p["5-star Rate"] && p["5-star Rate"] > 0);
      const dayAvgRating = dayRatings.length > 0 ? dayRatings.reduce((s, p) => s + p["5-star Rate"], 0) / dayRatings.length : 0;

      const dayBooksCount = books.filter((b) => {
        const uploadDate = toDateKey(b["upload_date"]);
        if (!uploadDate) return false;
        return uploadDate == key && b["is_active"];
      }).length;

      revenuesSeries.push(parseFloat(dayRevenue.toFixed(2)));
      listeningMinutesSeries.push(Math.round(dayListening));
      uploadedBooksSeries.push(dayBooksCount);
      ratingSeries.push(parseFloat(dayAvgRating.toFixed(1)));
    }

    // Calculate changes (compare current totals vs previous period totals)
    const revenuesChange = calculatePercentageChange(currentRevenues, previousRevenues);
    const listeningMinutesChange = calculatePercentageChange(currentListeningMinutes,previousListeningMinutes);
    const uploadedBooksChange = calculatePercentageChange(currentUploadedBooksCount, previousUploadedBooksCount);
    const ratingChange = calculatePercentageChange(currentAverageRating, previousAverageRating);

    return {
      totalRevenues: parseFloat(currentRevenues.toFixed(2)),
      totalListeningMinutes: Math.round(currentListeningMinutes),
      uploadedBooksCount: currentUploadedBooksCount,
      averageRating: parseFloat(currentAverageRating.toFixed(1)),
      revenuesChange,
      listeningMinutesChange,
      uploadedBooksChange,
      ratingChange,
      labels,
      revenuesSeries,
      listeningMinutesSeries,
      uploadedBooksSeries,
      ratingSeries,
    };
  } catch (error) {
    console.error("Error calculating dashboard metrics:", error);
    throw error;
  }
}
