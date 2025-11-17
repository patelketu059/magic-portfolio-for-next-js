import { NextResponse } from 'next/server';

export function GET() {
  // Safe alias: redirect legacy/alternate path to the canonical /experience page
  return NextResponse.redirect(new URL('/experience', 'http://localhost'));
}
