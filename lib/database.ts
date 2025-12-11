import { Api } from "nocodb-sdk";
import { Record } from "./schema";

interface NocodbRecord {
  Id: number;
  UpdatedAt: string;
  CreatedAt: string;
  [key: string]: any;
}

export class DatabaseClient {

  private constructor() {}

  static databaseProvider: Api<unknown> | null = null;

  static BASE_NAME = "noco";
  static PROJECT_ID = "p8dlj21i1927byp";
  static TOKEN = 'FdeErmezyh8-O8xXdgmKqb2oK7x4o4ec3kID8AV2';

  static getContext(): Api<unknown> {
    if (!DatabaseClient.databaseProvider) {
      DatabaseClient.databaseProvider = new Api({
          baseURL: "https://app.nocodb.com",
          headers: {
            "Authorization": `Bearer ${this.TOKEN}`
          }
      })
    }
    return DatabaseClient.databaseProvider;
  }

  static async getManyRecords<T>(tableId: string, options: { pageSize?: number; sort?: { field: string; direction: "asc" | "desc" }[], maxRecords?: number } = {}): Promise<T[]> {
    const result = await DatabaseClient.getContext().dbTableRow.list(
        DatabaseClient.BASE_NAME,
        DatabaseClient.PROJECT_ID,
        tableId,
        {
          limit: options.pageSize || 100,
          sort: Object.values(options.sort || {}).map(s => (s.direction === 'desc' ? ' -' : ' ') + s.field).join(',') || undefined,
        }
    )
    const records = result.list as NocodbRecord[]

    return records.map(record => {
      const { Id, CreatedAt, UpdatedAt, ...fields } = record;
      return { id: Id.toString(), ...fields } as T;
    }) as T[];
  }

  static getManyRecordsByFormula<T>(tableId: string, formula: string, options: { pageSize?: number, maxRecords?: number, sort?: { field: string; direction: "asc" | "desc" }[] } = {}): Promise<T[]> {
    // const allRecords: T[] = [];
    // return new Promise((resolve, reject) => {
    //   console.log('Fetching records from table:', tableId, 'with formula:', formula, 'and options:', options);
    //   DatabaseClient.getContext()(tableId)
    //       .select({ pageSize: options.pageSize || 100, maxRecords: options.maxRecords || 1000, filterByFormula: formula, sort: options.sort || [] })
    //       .eachPage(
    //         (records: Airtable.Records<FieldSet>, fetchNextPage: () => void) => {
    //           allRecords.push(
    //             ...records.map((r: any) => ({
    //               id: r.id,
    //               ...(r.fields || {}),
    //             } as T))
    //           );
    //           fetchNextPage();
    //         },
    //         (err?: any) => {
    //           if (err) return reject(err);
    //           resolve(allRecords);
    //         }
    //       );
    // });
    return Promise.resolve([]);
  }

  static async getOneRecordById<T>(tableId: string, recordId: string): Promise<T | null> {
    let result = await DatabaseClient.getContext().dbTableRow.findOne(
        DatabaseClient.BASE_NAME,
        DatabaseClient.PROJECT_ID,
        tableId,
        {
          where: `(Id,eq,${recordId})`,
        }
    ) as NocodbRecord | null;
    if (!result) {
      return null;
    } else {
      const { Id, CreatedAt, UpdatedAt, ...fields } = result;
      return { id: Id.toString(), ...fields } as T;
    }
  }

  static async getOneRecordByFormula<T extends Record>(tableId: string, formula: string): Promise<T | null> {
    let result = await DatabaseClient.getContext().dbTableRow.findOne(
        DatabaseClient.BASE_NAME,
        DatabaseClient.PROJECT_ID,
        tableId,
        {
          where: formula,
        }
    ) as NocodbRecord | null;
    if (!result) {
      return null;
    } else {
      const { Id, CreatedAt, UpdatedAt, ...fields } = result;
      return { id: Id.toString(), ...fields } as T;
    }
  }

}