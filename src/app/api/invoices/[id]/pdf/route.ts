import { NextRequest, NextResponse } from 'next/server';
import { backendFetch } from '@/lib/backend';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const outResponse = new NextResponse();
  const res = await backendFetch(`/invoices/${id}/pdf`, { method: 'GET' }, request, outResponse);

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: 'Failed to generate PDF' }));
    return NextResponse.json(body, { status: res.status });
  }

  const pdf = await res.arrayBuffer();
  const filename = res.headers.get('Content-Disposition')?.match(/filename="?([^"]+)"?/)?.[1]
    ?? `invoice-${id}.pdf`;

  return new NextResponse(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
