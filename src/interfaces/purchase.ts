//src/interfaces/purchase.ts

import { RequestQuote } from "./RequesQuote";

/**
 * Representa un producto/ítem dentro del detalle de una compra.
 * Basado en PurchaseItemDto.
 */
export interface PurchaseItem {
    id: number;
    name: string;
    brandModel: string | null;
    description: string | null;
    unit: string;
    size: string | null;
    quantity: number;
}

/**
 * Representa la información mínima para el listado/tablas de Compras.
 * Basado en PurchaseSummaryDto.
 */
export interface PurchaseSummary {
    id: number;
    purchaseNumber: string;
    projectName: string;
    status: string;
    requestDate: string; // ISO 8601 string desde el backend
    requester: string;
    itemsCount: number;
}

/**
 * Información completa para vistas de detalle de la Compra.
 * Basado en PurchaseDetailDto.
 */
export interface PurchaseDetail {
    id: number;
    purchaseNumber: string;
    projectName: string;
    status: string;
    requestDate: string;
    updatedAt: string;
    requester: string;
    observations: string | null;
    purchaseItems: PurchaseItem[];
    requestQuote: RequestQuote | null; 
    hasPurchaseOrder: boolean;
}

/**
 * Datos requeridos para crear un ítem/producto nuevo en una solicitud.
 * Basado en PurchaseItemCreateDto.
 */
export interface PurchaseItemCreate {
    name: string;
    brandModel?: string;
    description?: string;
    unit: string;
    size?: string;
    quantity: number;
}

/**
 * Datos requeridos para crear una nueva Compra desde el sistema externo.
 * Basado en PurchaseCreateDto.
 */
export interface PurchaseCreate {
    purchaseNumber: string;
    projectName: string;
    requester: string;
    observations?: string;
    items: PurchaseItemCreate[];
}

/**
 * Datos para actualizar la cabecera de una Compra existente.
 * Basado en PurchaseUpdateDto.
 */
export interface PurchaseUpdate {
    projectName: string;
    requester: string;
    observations?: string;
}


export interface PurchaseSummary {
    id: number;
    purchaseNumber: string;
    projectName: string;
    status: string;
    requestDate: string; 
    requester: string;
    itemsCount: number;
}