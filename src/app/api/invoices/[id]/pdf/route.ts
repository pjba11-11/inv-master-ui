import { NextResponse } from 'next/server';

// Dummy PDF endpoint — real implementation would call the Spring Boot backend
// which generates the PDF server-side and returns binary content.
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return NextResponse.json({
    message: 'PDF generation is handled by the Spring Boot backend. Integrate with GET /invoices/{id}/pdf once the backend is running.',
    invoiceId: id,
  });
}
