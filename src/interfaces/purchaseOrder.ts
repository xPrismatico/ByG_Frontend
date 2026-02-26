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

    // Datos de Formalización
    costCenter: string;

    // Logística y Administrativa
    paymentForm?: string;
    paymentTerms?: string;

    // Fechas (En formato string YYYY-MM-DD para input date)
    expectedDeliveryDate?: string; // DateOnly string (YYYY-MM-DD)
    deliveryDeadline?: string;

    shippingAddress?: string;
    shippingMethod?: string;
    observations?: string;

    // Datos Financieros (Nuevos)
    currency?: string;
    discount?: number;
    freightCharge?: number; // Costo de flete

    // Firmas
    approverName?: string;
    approverRut?: string;
    approverRole?: string;
}

/**
 * DTO para ACTUALIZAR una Orden de Compra existente.
 * Coincide con UpdatePurchaseOrderDto del Backend.
 */
export interface PurchaseOrderUpdate {
    costCenter?: string;
    paymentForm?: string;
    paymentTerms?: string;
    shippingAddress?: string;
    shippingMethod?: string;
    observations?: string;
    expectedDeliveryDate?: string;
    deliveryDeadline?: string;
    discount?: number;
    freightCharge?: number;
}

// --- DETALLE DE ORDEN DE COMPRA (Coincide con PurchaseOrderDetailDto) ---

export interface SupplierInfo {
    rut: string;
    businessName: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    contactName?: string;
}

export interface PurchaseOrderItem {
    name: string;
    description?: string;
    unit: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface PurchaseOrderDetail {
    id: number;
    orderNumber: string;      // "OC-2026-XXXX"
    status: string;           // "Emitida", etc.
    date: string;             // ISO String
    costCenter?: string;
    
    // Referencias
    purchaseId: number;
    purchaseNumber: string;
    projectName: string;

    // Proveedor (Objeto anidado en el DTO)
    supplier: SupplierInfo;

    // Logística
    paymentForm?: string;
    paymentTerms?: string;
    currency: string;
    expectedDeliveryDate?: string; // "YYYY-MM-DD"
    deliveryDeadline?: string;     // ISO String
    shippingAddress?: string;
    shippingMethod?: string;
    observations?: string;

    // Items
    items: PurchaseOrderItem[];

    // Totales Financieros
    subTotal: number;
    discount: number;
    freightCharge: number;
    taxExemptTotal: number;
    taxRate: number;
    taxAmount: number;
    totalAmount: number;

    // Aprobación
    approverName?: string;
    approverRole?: string;
    signedAt?: string;
}