import { describe, expect, it } from 'vitest';
import { calculateInvoiceTotals } from './invoice-calc';

describe('calculateInvoiceTotals', () => {
  it('returns zeroed totals for an empty items array', () => {
    expect(calculateInvoiceTotals([], 0)).toEqual({
      subtotal: 0,
      cgst: 0,
      sgst: 0,
      grandTotal: 0,
    });
  });

  it('computes totals for a single item', () => {
    const result = calculateInvoiceTotals([{ quantity: 2, unitPrice: 100 }], 0);
    expect(result.subtotal).toBe(200);
    expect(result.cgst).toBeCloseTo(18);
    expect(result.sgst).toBeCloseTo(18);
    expect(result.grandTotal).toBeCloseTo(236);
  });

  it('computes totals for multiple items', () => {
    const result = calculateInvoiceTotals(
      [
        { quantity: 2, unitPrice: 100 },
        { quantity: 1, unitPrice: 50 },
        { quantity: 3, unitPrice: 10 },
      ],
      0,
    );
    // subtotal = 200 + 50 + 30 = 280
    expect(result.subtotal).toBe(280);
    expect(result.cgst).toBeCloseTo(25.2);
    expect(result.sgst).toBeCloseTo(25.2);
    expect(result.grandTotal).toBeCloseTo(330.4);
  });

  it('subtracts the discount once from subtotal + CGST + SGST', () => {
    const result = calculateInvoiceTotals([{ quantity: 1, unitPrice: 1000 }], 50);
    // subtotal = 1000, gst = 180, grandTotal = 1000 + 180 - 50 = 1130
    expect(result.subtotal).toBe(1000);
    expect(result.cgst).toBeCloseTo(90);
    expect(result.sgst).toBeCloseTo(90);
    expect(result.grandTotal).toBeCloseTo(1130);
  });

  it('defaults discount to 0 when not provided', () => {
    const result = calculateInvoiceTotals([{ quantity: 1, unitPrice: 100 }]);
    expect(result.grandTotal).toBeCloseTo(118);
  });

  it('handles an explicit discount of 0', () => {
    const result = calculateInvoiceTotals([{ quantity: 1, unitPrice: 100 }], 0);
    expect(result.grandTotal).toBeCloseTo(118);
  });

  it('handles fractional quantities and unit prices without introducing extra rounding', () => {
    const result = calculateInvoiceTotals([{ quantity: 1.5, unitPrice: 33.33 }], 2.5);
    const expectedSubtotal = 1.5 * 33.33;
    const expectedCgst = expectedSubtotal * 0.09;
    const expectedSgst = expectedSubtotal * 0.09;
    const expectedGrandTotal = expectedSubtotal + expectedCgst + expectedSgst - 2.5;

    expect(result.subtotal).toBe(expectedSubtotal);
    expect(result.cgst).toBe(expectedCgst);
    expect(result.sgst).toBe(expectedSgst);
    expect(result.grandTotal).toBe(expectedGrandTotal);
  });
});
