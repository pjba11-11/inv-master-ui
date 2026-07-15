import { describe, expect, it } from 'vitest';
import { normalizeInvoice } from './normalize';

describe('normalizeInvoice', () => {
  it('maps invoiceId to id when id is missing', () => {
    const result = normalizeInvoice({ invoiceId: 42, total: 100 });
    expect(result).toEqual({ invoiceId: 42, total: 100, id: 42 });
  });

  it('leaves the object unchanged when id is already present', () => {
    const input = { invoiceId: 42, id: 7, total: 100 };
    const result = normalizeInvoice(input);
    expect(result).toEqual(input);
  });

  it('leaves the object unchanged when invoiceId is absent', () => {
    const input = { id: 7, total: 100 };
    const result = normalizeInvoice(input);
    expect(result).toEqual(input);
  });

  it('does not mutate the original object when remapping', () => {
    const input = { invoiceId: 42 };
    const result = normalizeInvoice(input);
    expect(result).not.toBe(input);
    expect(input).toEqual({ invoiceId: 42 });
  });

  it('preserves other fields alongside the remapped id', () => {
    const result = normalizeInvoice({ invoiceId: 5, customerName: 'Acme', grandTotal: 236.5 });
    expect(result).toEqual({ invoiceId: 5, customerName: 'Acme', grandTotal: 236.5, id: 5 });
  });

  it('handles an empty object', () => {
    expect(normalizeInvoice({})).toEqual({});
  });
});
