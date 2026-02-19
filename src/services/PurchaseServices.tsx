import { ApiBackend } from '@/clients/Axios';
import { PagedResponse } from '@/interfaces/PagedResponse';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import {
    PurchaseSummary,
    PurchaseDetail,
    PurchaseCreate,
    PurchaseUpdate
} from '@/interfaces/purchase';
import { AxiosError } from 'axios';


// Ruta base para el controlador de Compras
const CONTROLLER_URL = '/api/purchase';

/**
 * Función auxiliar para manejar errores de Axios y asegurar que 
 * siempre devolvemos una estructura ResponseAPI genérica.
 */
const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        // El backend devolvió un ApiResponse con errores (ej. 404, 409 Conflict)
        return error.response.data as ResponseAPI<any>;
    }
    // Error de red, timeout o error interno 500 no controlado
    return {
        success: false,
        message: 'Error de conexión con el servidor.',
        data: null,
        errors: ['Ocurrió un error inesperado al procesar la solicitud.'],
    };
};

export const PurchaseServices = {
    /**
     * Obtiene la lista resumida de todas las compras para la tabla principal.
     * @returns Promesa con arreglo de PurchaseSummary ordenado por fecha de solicitud y paginado.
     */
    getPurchases: async (params: { 
        search?: string; 
        status?: string; 
        startDate?: string; 
        endDate?: string; 
        sortBy?: string; 
        pageNumber: number; 
        pageSize?: number 
    }): Promise<ResponseAPI<PagedResponse<PurchaseSummary>>> => {
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
            );

            const response = await ApiBackend.get(`${CONTROLLER_URL}`, { params: cleanParams });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Obtiene el detalle completo de una compra por su ID, incluyendo sus productos.
     * @param id Identificador único de la compra.
     */
    getPurchaseById: async (id: number): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<PurchaseDetail>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Crea una nueva compra (generalmente accionada desde el sistema externo).
     * @param data Objeto con la información de la compra y sus productos (PurchaseCreate).
     */
    createPurchase: async (data: PurchaseCreate): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<PurchaseDetail>>(CONTROLLER_URL, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Actualiza la información de la cabecera de una compra existente.
     * Nota: No actualiza el estado.
     * @param id Identificador único de la compra.
     * @param data Objeto con la información a actualizar (PurchaseUpdate).
     */
    updatePurchase: async (id: number, data: PurchaseUpdate): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.put<ResponseAPI<PurchaseDetail>>(`${CONTROLLER_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Actualiza específicamente el estado de una compra avanzando su flujo.
     * @param id Identificador único de la compra.
     * @param newStatus El nuevo estado de la compra (ej. "Esperando revisión").
     */
    updatePurchaseStatus: async (id: number, newStatus: string): Promise<ResponseAPI<string>> => {
        try {
            // Nota: .NET exige que un [FromBody] string venga entre comillas (JSON String).
            // Usamos JSON.stringify para evitar errores 400 Bad Request.
            const response = await ApiBackend.patch<ResponseAPI<string>>(
                `${CONTROLLER_URL}/${id}/status`,
                JSON.stringify(newStatus), 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Elimina una compra del sistema si no ha iniciado su flujo de cotización.
     * @param id Identificador único de la compra.
     */
    deletePurchase: async (id: number): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.delete<ResponseAPI<string>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};