import Airtable, { FieldSet } from "airtable";
import { PerformanceRecord, AIRTABLE_CONFIG, InvoicesRecord } from "./schema";
import { getEnv } from "./utils";

const DATABASE_API_KEY = getEnv("DATABASE_API_KEY");
const DATABASE_BASE_ID = getEnv("DATABASE_BASE_ID");


export class DatabaseClient {

  private constructor() {}

  static databaseProvider: Airtable.Base | null = null;

  static getContext(): Airtable.Base {
    if (!DatabaseClient.databaseProvider) {
      DatabaseClient.databaseProvider = new Airtable({ apiKey: DATABASE_API_KEY }).base(DATABASE_BASE_ID);
    }
    return DatabaseClient.databaseProvider;
  }

  static getManyRecords<T>(tableId: string, options: { pageSize?: number; sort?: { field: string; direction: "asc" | "desc" }[], maxRecords?: number } = {}): Promise<T[]> {
    const allRecords: T[] = [];
    return new Promise((resolve, reject) => {
      DatabaseClient.getContext()(tableId)
          .select({ pageSize: options.pageSize || 100, maxRecords: options.maxRecords || 1000, sort: options.sort || [] })
          .eachPage(
            (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
              allRecords.push(
                ...records.map((r: any) => ({
                  id: r.id,
                  ...(r.fields || {}),
                } as T))
              );
              fetchNextPage();
            },
            (err?: any) => {
              if (err) return reject(err);
              resolve(allRecords);
            }
          );
    });
  }

  static getManyRecordsByFormula<T>(tableId: string, formula: string, options: { pageSize?: number, maxRecords?: number, sort?: { field: string; direction: "asc" | "desc" }[] } = {}): Promise<T[]> {
    const allRecords: T[] = [];
    return new Promise((resolve, reject) => {
      console.log('Fetching records from table:', tableId, 'with formula:', formula, 'and options:', options);
      DatabaseClient.getContext()(tableId)
          .select({ pageSize: options.pageSize || 100, maxRecords: options.maxRecords || 1000, filterByFormula: formula, sort: options.sort || [] })
          .eachPage(
            (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
              allRecords.push(
                ...records.map((r: any) => ({
                  id: r.id,
                  ...(r.fields || {}),
                } as T))
              );
              fetchNextPage();
            },
            (err?: any) => {
              if (err) return reject(err);
              resolve(allRecords);
            }
          );
    });
  }

  static getOneRecordById<T>(tableId: string, recordId: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      DatabaseClient.getContext()(tableId)
        .find(recordId, (error: any, record: Airtable.Record<FieldSet> | undefined) => {
          if (error || record == undefined) {
            if (error.statusCode === 404) {
              resolve(null);
            } else {
              reject(error);
            }
          } else {
            resolve({
              id: record.id,
              ...(record.fields || {}),
            } as T);
          }
        });
    });
  }

  static getOneRecordByFormula<T>(tableId: string, formula: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      DatabaseClient.getContext()(tableId)
        .select({ maxRecords: 1, filterByFormula: formula })
        .firstPage((err, records) => {
          if (err) {
            reject(err);
          } else {
            if (records && records.length > 0) {
              resolve({
                id: records[0].id,
                ...(records[0].fields || {}),
              } as T);
            } else {
              resolve(null);
            }
          }
        });
    });
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

    return new Promise(async (resolve, reject) => {
      const all: PerformanceRecord[] = await DatabaseClient.getManyRecords<PerformanceRecord>(AIRTABLE_CONFIG.tables.performanceRecords.id);

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

    return new Promise(async (resolve, reject) => {
      const all = await DatabaseClient.getManyRecords<InvoicesRecord>(AIRTABLE_CONFIG.tables.invoices.id);

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
    });
  } catch (error) {
    console.error("Error fetching revenue metrics:", error);
    throw error;
  }
}