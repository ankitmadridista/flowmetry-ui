export const ObjId = {
  FLOWMETRY: 1,
  DASHBOARD: 2,
  INVOICES: 3,
  CUSTOMERS: 4,
  PAYMENTS: 5,
  REPORTS: 6,
} as const;

export const OpId = {
  VIEW: 1,
  CREATE: 2,
  EDIT: 3,
  DELETE: 4,
  COPY: 5,
  MANAGE: 6,
} as const;

export const PERMISSION_MAP: Record<number, { objId: number; operationId: number }> = {
  1:  { objId: 2, operationId: 1 }, // Dashboard - View
  2:  { objId: 2, operationId: 2 }, // Dashboard - Create
  3:  { objId: 2, operationId: 3 }, // Dashboard - Edit
  4:  { objId: 2, operationId: 4 }, // Dashboard - Delete
  5:  { objId: 3, operationId: 1 }, // Invoices - View
  6:  { objId: 3, operationId: 2 }, // Invoices - Create
  7:  { objId: 3, operationId: 3 }, // Invoices - Edit
  8:  { objId: 3, operationId: 4 }, // Invoices - Delete
  9:  { objId: 4, operationId: 1 }, // Customers - View
  10: { objId: 4, operationId: 2 }, // Customers - Create
  11: { objId: 4, operationId: 3 }, // Customers - Edit
  12: { objId: 4, operationId: 4 }, // Customers - Delete
  13: { objId: 5, operationId: 1 }, // Payments - View
  14: { objId: 5, operationId: 2 }, // Payments - Create
  15: { objId: 5, operationId: 3 }, // Payments - Edit
  16: { objId: 5, operationId: 4 }, // Payments - Delete
  17: { objId: 6, operationId: 1 }, // Reports - View
  18: { objId: 6, operationId: 2 }, // Reports - Create
  19: { objId: 6, operationId: 3 }, // Reports - Edit
  20: { objId: 6, operationId: 4 }, // Reports - Delete
};
