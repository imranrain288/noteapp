import { NextResponse } from 'next/server';

// Direct response for initialization to avoid any parsing issues
export async function GET() {
  // Create a new response for each request
  return NextResponse.json({
    success: true,
    config: {}
  });
}

export async function POST() {
  // Create a new response for each request
  return NextResponse.json({
    success: true,
    config: {}
  });
}
