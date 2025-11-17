import { NextResponse } from "next/server";

// Blog has been removed — RSS feed is not available.
export async function GET() {
  return new NextResponse(null, { status: 404 });
}
