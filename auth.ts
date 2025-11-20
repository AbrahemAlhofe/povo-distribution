import Database from "better-sqlite3";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: new Database(process.env.DATABASE_URL || "database.sqlite"),
    appName: "povo-distribution",
    plugins: [nextCookies()],
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 1,
    },
});
