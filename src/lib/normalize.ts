// Backend uses invoiceId; UI uses id
export function normalizeInvoice(inv: Record<string, unknown>) {
  if ('invoiceId' in inv && !('id' in inv)) {
    return { ...inv, id: inv.invoiceId };
  }
  return inv;
}
