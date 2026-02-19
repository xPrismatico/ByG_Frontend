export interface PurchaseOrderSummary {
    id: number;
    orderNumber: string;    // Ej: OC-2026-045
    supplierName: string;   // Vital: A quién se le paga
    projectName: string;    // Vital: Centro de costo/obra
    issueDate: string;      // ISO String
    totalAmount: number;    // Monto total con IVA
    currency: string;       // CLP o USD
    status: "Emitida" | "Recepcionada" | "Facturada" | "Cerrada" | "Anulada";
}