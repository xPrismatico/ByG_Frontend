import { ApiBackend } from '@/clients/Axios';
import { PagedResponse } from '@/interfaces/PagedResponse';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import {
    SupplierSummary,
    SupplierDetail,
    SupplierCreate,
    SupplierUpdate
} from '@/interfaces/supplier';
import { AxiosError } from 'axios';

// Definimos la ruta base para este controlador
const CONTROLLER_URL = '/api/supplier';

/**
 * Función auxiliar para manejar errores de Axios y asegurar que 
 * siempre devolvemos una estructura ResponseAPI, incluso si falla la red.
 */
const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        // El backend devolvió un ApiResponse con errores (ej. 404, 409)
        return error.response.data as ResponseAPI<any>;
    }
    // Error de red, timeout o error interno no controlado
    return {
        success: false,
        message: 'Error de conexión con el servidor.',
        data: null,
        errors: ['Ocurrió un error inesperado al procesar la solicitud.'],
    };
};

export const SupplierService = {
    /**
     * Obtiene la lista resumida paginada y filtrada los proveedores
     * @returns Una promesa con la respuesta genérica conteniendo un arreglo de SupplierSummary.
     */
getSuppliers: async (params?: { 
        search?: string; 
        isActive?: boolean; 
        productCategory?: string; 
        startDate?: string; 
        endDate?: string; 
        sortBy?: string; 
        pageNumber?: number; 
        pageSize?: number 
    }): Promise<ResponseAPI<PagedResponse<SupplierSummary>>> => {
        try {
            // Limpieza de parámetros: eliminamos undefined, null o strings vacíos
            const cleanParams = params ? Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
            ) : {};

            const response = await ApiBackend.get<ResponseAPI<PagedResponse<SupplierSummary>>>(CONTROLLER_URL, { params: cleanParams });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Obtiene el detalle completo de un proveedor por su ID
     * @param id Identificador único del proveedor
     */
    getSupplierById: async (id: number): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<SupplierDetail>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Crea un nuevo proveedor en el sistema
     * @param data Objeto con la información requerida (SupplierCreate).
     */
    createSupplier: async (data: SupplierCreate): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<SupplierDetail>>(CONTROLLER_URL, data);
            return response.data; // Retorna 201 Created con el detalle
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Actualiza la información de un proveedor existente
     * @param id Identificador único del proveedor.
     * @param data Objeto con la información a actualizar (SupplierUpdate)
     */
    updateSupplier: async (id: number, data: SupplierUpdate): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.put<ResponseAPI<SupplierDetail>>(`${CONTROLLER_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Cambia el estado (Activo/Inactivo) de un proveedor
     * @param id Identificador único del proveedor.
     * @returns Respuesta genérica donde 'data' es un booleano con el nuevo estado
     */
    toggleSupplierStatus: async (id: number): Promise<ResponseAPI<boolean>> => {
        try {
            const response = await ApiBackend.patch<ResponseAPI<boolean>>(`${CONTROLLER_URL}/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Elimina definitivamente un proveedor del sistema
     * Precaución: Fallará (409 Conflict) si tiene historial asociado
     * @param id Identificador único del proveedor.
     */
    deleteSupplier: async (id: number): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.delete<ResponseAPI<string>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};