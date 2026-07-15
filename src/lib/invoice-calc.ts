export interface InvoiceLineItem {
  quantity: number;
  unitPrice: number;
}

export interface InvoiceTotals {
  subtotal: number;
  cgst: number;
  sgst: number;
  grandTotal: number;
}

/**
 * Computes invoice totals for Indian GST invoicing: CGST and SGST are each
 * a fixed 9% of the subtotal (18% total GST), and the discount is
 * subtracted once from subtotal + CGST + SGST.
 */
export function calculateInvoiceTotals(
  items: InvoiceLineItem[],
  discount = 0,
): InvoiceTotals {
  const subtotal = items.reduce((s, item) => s + item.quantity * item.unitPrice, 0);
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const grandTotal = subtotal + cgst + sgst - discount;

  return { subtotal, cgst, sgst, grandTotal };
}
