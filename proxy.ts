import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
export async function proxy(request: NextRequest) {
    const cookieStore = cookies();
    const session = (await cookieStore).get("session");
    if(!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
}
export const config = {
  matcher: "/"
};