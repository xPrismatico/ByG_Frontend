// src/services/PurchaseOrderServices.ts

import { ApiBackend } from '@/clients/Axios';
import { PagedResponse } from '@/interfaces/PagedResponse';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import { 
    PurchaseOrderSummary, 
    PurchaseOrderFilters,
    PurchaseOrderCreate,
    PurchaseOrderDetail // Importar nueva interfaz
} from '@/interfaces/purchaseOrder';
import { AxiosError } from 'axios';

const CONTROLLER_URL = '/api/purchaseorder';

const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        // A veces la respuesta es un Blob (PDF) y no JSON, hay que tener cuidado
        if (error.response.data instanceof Blob) {
             return { success: false, message: "Error al descargar el archivo.", data: null, errors: [] };
        }
        return error.response.data as ResponseAPI<any>;
    }
    return {
        success: false,
        message: 'Error de conexión.',
        data: null,
        errors: ['Ocurrió un error inesperado.'],
    };
};

export const PurchaseOrderServices = {
    
    // ... (getAll y create se mantienen igual) ...
    getAll: async (params: PurchaseOrderFilters): Promise<ResponseAPI<PagedResponse<PurchaseOrderSummary>>> => {
        // ... (código existente)
        try {
            const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v));
            const response = await ApiBackend.get(CONTROLLER_URL, { params: cleanParams });
            return response.data;
        } catch (error) { return handleApiError(error); }
    },

    /**
     * Obtiene el detalle completo.
     */
    getById: async (id: number): Promise<ResponseAPI<PurchaseOrderDetail>> => { 
        try {
            const response = await ApiBackend.get<ResponseAPI<PurchaseOrderDetail>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Descarga el PDF de la Orden de Compra.
     * Retorna un Blob para que el frontend lo maneje.
     */
    downloadPdf: async (id: number): Promise<Blob | null> => {
        try {
            const response = await ApiBackend.get(`${CONTROLLER_URL}/${id}/pdf`, {
                responseType: 'blob' // Importante para archivos
            });
            return response.data;
        } catch (error) {
            console.error("Error downloading PDF", error);
            return null;
        }
    },
    
    create: async (data: PurchaseOrderCreate): Promise<ResponseAPI<any>> => {
         try {
            const response = await ApiBackend.post(CONTROLLER_URL, data);
            return response.data;
        } catch (error) { return handleApiError(error); }
    }
};