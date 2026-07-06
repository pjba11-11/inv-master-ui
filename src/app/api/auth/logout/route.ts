import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real app, we would clear the session or JWT token here
  // For this mock, we just return a success response
  
  return NextResponse.json({ 
    message: 'Logged out successfully' 
  });
}
