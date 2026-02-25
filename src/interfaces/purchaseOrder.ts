// src/interfaces/purchaseOrder.ts

/**
 * Representa la fila de la tabla de Órdenes de Compra.
 * Debe coincidir con el JSON de PurchaseOrderSummaryDto del Backend.
 */
export interface PurchaseOrderSummary {
    id: number;
    orderNumber: string;      // Ej: OC-2026-0001
    purchaseNumber: string;   // Folio de la solicitud original (Reference)
    projectName: string;      // Centro de costo / Obra
    supplierName: string;     // Proveedor
    date: string;             // ISO Date que viene del backend
    totalAmount: number;      // Total con IVA
    status: string;           // Estado (Emitida, Recepcionada, etc.)
}

/**
 * Filtros disponibles para la búsqueda de OCs.
 * Coincide con PurchaseOrderQueryParameters del Backend.
 */
export interface PurchaseOrderFilters {
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    pageNumber?: number;
    pageSize?: number;
}

/**
 * DTO para crear una Orden de Compra (cuando lo integremos más adelante).
 * Basado en CreatePurchaseOrderDto.
 */
export interface PurchaseOrderCreate {
    purchaseId: number;
    quoteId: number;
    paymentForm?: string;
    paymentTerms?: string;
    expectedDeliveryDate?: string; // DateOnly string (YYYY-MM-DD)
    shippingAddress?: string;
    shippingMethod?: string;
    observations?: string;
    approverName?: string;
    approverRut?: string;
    approverRole?: string;
}