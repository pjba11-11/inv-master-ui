import { NextResponse } from 'next/server';

// Shape matches MaterialPriceHistoryDTO: effectiveFrom / effectiveTo (not effectiveDate / recordedAt).
let priceHistory = [
  { id: 1, materialId: 1, price: 14.00, effectiveFrom: '2024-01-01', effectiveTo: '2024-01-31', createdAt: '2024-01-01T00:00:00Z' },
  { id: 2, materialId: 1, price: 15.50, effectiveFrom: '2024-02-01', effectiveTo: '2024-02-29', createdAt: '2024-02-01T00:00:00Z' },
  { id: 3, materialId: 1, price: 16.00, effectiveFrom: '2024-03-01', effectiveTo: null as string | null,   createdAt: '2024-03-01T00:00:00Z' },
  { id: 4, materialId: 2, price: 2.50,  effectiveFrom: '2024-01-15', effectiveTo: '2024-02-28', createdAt: '2024-01-15T00:00:00Z' },
  { id: 5, materialId: 2, price: 2.75,  effectiveFrom: '2024-03-01', effectiveTo: null as string | null,   createdAt: '2024-03-01T00:00:00Z' },
];

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const history = priceHistory
    .filter(h => h.materialId === Number(id))
    .sort((a, b) => new Date(b.effectiveFrom).getTime() - new Date(a.effectiveFrom).getTime());
  return NextResponse.json(history);
}
