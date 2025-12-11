import Airtable, { FieldSet } from "airtable";
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