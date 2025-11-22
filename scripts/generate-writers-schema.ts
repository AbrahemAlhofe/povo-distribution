import Airtable from "airtable";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

async function main() {
  const AIRTABLE_KEY = getEnv("AIRTABLE_API_KEY");
  const AIRTABLE_BASE = getEnv("AIRTABLE_BASE_ID");
  // You can pass either a table name or table id via WRITERS_TABLE env var
  const WRITERS_TABLE = process.env.WRITERS_TABLE || "Writers";

  const base = new (Airtable as any)({ apiKey: AIRTABLE_KEY }).base(AIRTABLE_BASE);

  const records = await base(WRITERS_TABLE).select({ pageSize: 5 }).firstPage();
  if (!records || records.length === 0) {
    console.error("No records found in the writers table. Make sure the table name/id is correct.");
    process.exit(1);
  }

  // collect all field names and sample types
  const fieldSamples: Record<string, any> = {};

  for (const r of records) {
    const fields = r.fields as Record<string, any>;
    for (const k of Object.keys(fields)) {
      const v = fields[k];
      if (!fieldSamples[k]) fieldSamples[k] = v;
    }
  }

  // Build TypeScript interface lines
  const lines: string[] = [];
  lines.push("export interface WritersRecord {");
  lines.push("  id: string;");

  for (const [k, v] of Object.entries(fieldSamples)) {
    const safeKey = k.match(/^[_A-Za-z][_0-9A-Za-z ]*$/) && !/\s/.test(k) ? k : `\"${k}\"`;
    const tsType = guessType(v);
    lines.push(`  ${safeKey}: ${tsType}; // ${describeField(v)}`);
  }

  lines.push("}");

  console.log("\n--- Generated interface (paste into lib/schema.ts) ---\n");
  console.log(lines.join("\n"));
  console.log("\n--- End ---\n");
}

function guessType(value: any): string {
  if (value === null || value === undefined) return "any";
  if (Array.isArray(value)) {
    if (value.length === 0) return "any[]";
    // check for array of strings/objects
    if (value.every((v) => typeof v === "string")) return "string[]";
    return "any[]";
  }
  switch (typeof value) {
    case "string":
      // try to detect date
      if (!isNaN(Date.parse(value))) return "string"; // date string
      return "string";
    case "number":
      return "number";
    case "boolean":
      return "boolean";
    case "object":
      // Airtable attachments are arrays of objects
      if (value && value.url) return "string";
      return "any";
    default:
      return "any";
  }
}

function describeField(value: any): string {
  if (value === null || value === undefined) return "unknown";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
