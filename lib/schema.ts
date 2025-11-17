/**
 * Airtable Schema for Povo Distribution Base
 * Base ID: app7jhjphxvFJdwzg
 * 
 * This file documents the complete structure and types for all tables
 * in the Airtable base.
 */

/**
 * Books Table
 * Main table containing book/audiobook information
 * Table ID: tblmfrxrr3kTnF3S6
 */
export interface BooksRecord {
  id: string;
  Title: string; // singleLineText (fldNQdwa0JVIBlA80)
  "Upload Date": string; // date - local format (fldZVQlKvaK7Qvbix)
  "Is Active": boolean; // checkbox (fld1QVdsRj4EpSiX2)
  
  // Relationships
  Client: string[]; // multipleRecordLinks to Clients (fldF7FjCZ9e34HqYD)
  Platform: string[]; // multipleRecordLinks to Platforms (fldl6PaSNjuAiOGR3)
  "Performance Records": string[]; // multipleRecordLinks to Performance Records (fld2iAUWXWDXzura9)
  
  // Lookup fields from Performance Records
  Revenues: number[]; // multipleLookupValues - currency (fldTeVOgAWFHbWbch)
  "Listening minutes": number[]; // multipleLookupValues - number (fldaAHNsi5xsORJ2j)
  
  // Formula fields
  "Total Revenues": number; // formula - SUM of Revenues (fldBnR6oxKBhzHYUF)
  "Total Listening Minutes": number; // formula - SUM of Listening minutes (fldBfD1OnP6RgWTrN)
}

/**
 * Performance Records Table
 * Tracks performance metrics for each book on each platform
 * Table ID: tbldniseBzBjpOrJK
 */
export interface PerformanceRecord {
  id: string;
  "Record Date": string; // date - local format (fld3ULAA3IQLy7ZOP)
  
  // Relationships
  Book: string; // multipleRecordLinks to Books (fld544g9eQKwTcBhs) - prefersSingleRecordLink
  Platform: string; // multipleRecordLinks to Platforms (fldExmUP7fBzTzaPT) - prefersSingleRecordLink
  Notes: string[]; // multipleRecordLinks to Notes (fldauz3ekxEF1eBGz)
  
  // Metrics
  Revenue: number; // currency ($) with 2 decimal precision (fld2N6hioS6CyMoZT)
  "Total Listening Minutes": number; // number with 1 decimal precision (fldWq6QbuGK2Rir89)
  "5-star Rate": number; // rating (1-5 stars) (fldKAJpunD84jy6ri)
  
  // Demographics - Gender percentages
  "Male Share": number; // percent with 0 decimal precision (fldKgvc2piFqYw2GQ)
  "Female Share": number; // percent with 0 decimal precision (fldSobLiQb7fARYNf)
  
  // Demographics - Age group percentages
  "( 18 - 24 ) Share": number; // percent with 0 decimal precision (fldRE9l5Wy6fwcr2f)
  "( 25 - 34 ) Share": number; // percent with 0 decimal precision (fldlo1j9Cz4pzDldt)
  "( 35 - 44 ) Share": number; // percent with 0 decimal precision (fldW4IFsA2CdYqW0P)
  
  // Top Listening Countries
  "Top Listening Countries": ("مصر" | "السعودية" | "المغرب" | "الجزائر" | "العراق" | "قطر")[]; // multipleSelects
  
  // Lookup - Client from linked Book
  Client: string[]; // multipleLookupValues from Book.Client (fldFEu50Ki77wCTKl)
}

/**
 * Notes Table
 * Stores notes and annotations
 * Table ID: tblkYGBdO17DUte3y
 */
export interface NotesRecord {
  id: string;
  "Note ID": number; // autoNumber (fldPX2dJNOFrjUq0n)
  Body: string; // multilineText (fldTt2VumTdpCJUo9)
  
  // Relationships
  "Performance Records": string[]; // multipleRecordLinks to Performance Records (fldyTQJg4p2QkCl2u)
}

/**
 * Clients Table
 * Information about content distribution clients
 * Table ID: tblSONl4s0bC6u3Ax
 */
export interface ClientsRecord {
  id: string;
  "Client Name": string; // singleLineText (fldWvmNZQY5V0f1ty)
  "Contact Email": string; // email (fld0OmUJfLGQ518vv)
  "Contact Phone": string; // phoneNumber (fldUiR6GgJQ8ahaci)
  Address: string; // singleLineText (fld05AHNvOQ0VG8C2)
  Performance: string; // singleLineText (fld5qr8UAbeHvIWSm)
  
  // Relationships
  Books: string[]; // multipleRecordLinks to Books (fldWKW6VVF4hwWPQ7)
  Platforms: string[]; // multipleRecordLinks to Platforms (fldcuqj1CpIxfSBMi)
  Invoices: string[]; // multipleRecordLinks to Invoices (fldTCpF1ivnhnpHIc)
}

/**
 * Platforms Table
 * Distribution platforms where content is published
 * Table ID: tblBii5YPnmfb1AF1
 */
export interface PlatformsRecord {
  id: string;
  "Platform Name": string; // singleLineText (fldpVkutPXdsO5upW)
  "Platform Type": "Web" | "Mobile" | "Desktop" | "Other"; // singleSelect (fldipXJ2BDGI4udLJ)
  "Platform Link": string; // url (fldkhmljiYWK71SWh)
  
  // Relationships
  Client: string; // multipleRecordLinks to Clients (fldr3NHxvYeRQ33ra) - prefersSingleRecordLink
  Performance: string[]; // multipleRecordLinks to Performance Records (fldshyXINYQhBdpyD)
  "الكتب المنشورة": string[]; // multipleRecordLinks to Books (fldnwr7STQ6UNVMtV)
}

/**
 * Invoices Table
 * Billing and payment records
 * Table ID: tbl270pCBvJcYyDLx
 */
export interface InvoicesRecord {
  id: string;
  "Invoice ID": number; // autoNumber (fld0gcjEK02gHudHQ)
  "Payment Date": string; // date - local format (fldZQQWC9EsSCmtRB)
  "Invoice Amount": number; // currency ($) with 2 decimal precision (fldUwNxHMd98ONyw4)
  "Is Paid": boolean; // checkbox (fldyhRc4mMqhvGM0a)
  
  // Relationships
  Client: string; // multipleRecordLinks to Clients (fldi6auxFvF5xaHSc) - prefersSingleRecordLink
}

/**
 * Notes Table (الملاحظات)
 * Stores notes and annotations related to books and platforms
 */
export interface NotesRecord {
  id: string;
  "Note Title"?: string; // singleLineText
  "Note Content"?: string; // multilineText
  Date?: string; // date (local format) - alternate field name
  
  // Relationships
  الكتب?: string[]; // multipleRecordLinks to Books
  
  // Lookups - Derived from linked books
  Client?: string[]; // multipleLookupValues from الكتب.Client
  "Related Platform"?: string[]; // multipleLookupValues from الكتب.Platform

  // Fallback for any additional fields
  [key: string]: any;
}

/**
 * Writers Table (placeholder)
 * Add exact fields by running the `scripts/generate-writers-schema.ts` script
 * which will fetch a sample record from Airtable and print a TypeScript
 * interface you can paste here. For now this is a permissive placeholder.
 */
export interface AuthorsRecord {
  id: string;
  // Example fields - replace with generated fields from the script below
  "Name"?: string; // singleLineText
  "Bio"?: string; // multilineText
  "Photo"?: string; // url or attachment
  "Nationality"?: string; // singleLineText
  "Birthdate"?: string; // date
  // Linked books
  Books?: string[]; // multipleRecordLinks to Books

  // Fallback for any additional fields until schema is generated
  [key: string]: any;
}

/**
 * Airtable Base Configuration Constants
 */
export const AIRTABLE_CONFIG = {
  baseId: "app7jhjphxvFJdwzg",
  apiKey: process.env.AIRTABLE_API_KEY,
  tables: {
    books: {
      id: "tblmfrxrr3kTnF3S6",
      name: "Books",
    },
    performanceRecords: {
      id: "tbldniseBzBjpOrJK",
      name: "Performance Records",
    },
    notes: {
      id: "tblkYGBdO17DUte3y",
      name: "Notes",
    },
    clients: {
      id: "tblSONl4s0bC6u3Ax",
      name: "Clients",
    },
    platforms: {
      id: "tblBii5YPnmfb1AF1",
      name: "Platforms",
    },
    invoices: {
      id: "tbl270pCBvJcYyDLx",
      name: "Invoices",
    },
    writers: {
      id: "tbl_Writers_PLACEHOLDER",
      name: "Writers",
    },
  },
} as const;

/**
 * Enum Constants
 */
export const PLATFORM_TYPES = ["Web", "Mobile", "Desktop", "Other"] as const;

export const TOP_LISTENING_COUNTRIES = ["مصر", "السعودية", "المغرب", "الجزائر", "العراق", "قطر"] as const;
