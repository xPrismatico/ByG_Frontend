// src/interfaces/supplier.ts

/**
 * Representa la información mínima para el listado/tablas.
 * Basado en SupplierSummaryDto[cite: 493].
 */
export interface SupplierSummary {
    id: number;
    rut: string;
    businessName: string;
    email: string;
    productCategories: string | null;
    isActive: boolean;
}

/**
 * Información completa para vistas de detalle o edición.
 * Basado en SupplierDetailDto[cite: 481].
 */
export interface SupplierDetail extends SupplierSummary {
    contactName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    registeredAt: string;
}

/**
 * Datos requeridos para crear un nuevo proveedor.
 * Basado en SupplierCreateDto[cite: 461].
 */
export interface SupplierCreate {
    rut: string;
    businessName: string;
    contactName?: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    productCategories?: string;
}

/**
 * Datos para actualización, incluye el estado activo.
 * Basado en SupplierUpdateDto[cite: 500].
 */
export interface SupplierUpdate extends SupplierCreate {
    isActive: boolean;
}