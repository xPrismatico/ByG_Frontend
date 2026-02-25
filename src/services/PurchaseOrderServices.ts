// src/services/PurchaseOrderServices.ts

import { ApiBackend } from '@/clients/Axios';
import { PagedResponse } from '@/interfaces/PagedResponse';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import { 
    PurchaseOrderSummary, 
    PurchaseOrderFilters,
    PurchaseOrderCreate 
} from '@/interfaces/purchaseOrder';
import { AxiosError } from 'axios';

// Ruta base coincidente con [Route("api/[controller]")] en tu PurchaseOrderController
const CONTROLLER_URL = '/api/purchaseorder';

/**
 * Helper para errores de Axios
 */
const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        return error.response.data as ResponseAPI<any>;
    }
    return {
        success: false,
        message: 'Error de conexión con el servidor.',
        data: null,
        errors: ['Ocurrió un error inesperado al procesar la solicitud.'],
    };
};

export const PurchaseOrderServices = {
    
    /**
     * Obtiene el listado paginado de Órdenes de Compra.
     * Conecta con: [HttpGet] GetAll([FromQuery] PurchaseOrderQueryParameters queryParams)
     */
    getAll: async (params: PurchaseOrderFilters): Promise<ResponseAPI<PagedResponse<PurchaseOrderSummary>>> => {
        try {
            // Limpiamos parámetros vacíos o nulos para limpiar la URL
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
            );

            const response = await ApiBackend.get<ResponseAPI<PagedResponse<PurchaseOrderSummary>>>(
                CONTROLLER_URL, 
                { params: cleanParams }
            );
            
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Obtiene el detalle de una OC por ID (para la vista individual o PDF).
     * Conecta con: [HttpGet("{id}")] GetPurchaseOrderById(int id)
     * Nota: Usaremos 'any' o crearás la interfaz 'PurchaseOrderDetail' cuando hagamos esa vista.
     */
    getById: async (id: number): Promise<ResponseAPI<any>> => { 
        try {
            const response = await ApiBackend.get(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Genera una nueva Orden de Compra.
     * Conecta con: [HttpPost] CreatePurchaseOrder([FromBody] CreatePurchaseOrderDto dto)
     */
    create: async (data: PurchaseOrderCreate): Promise<ResponseAPI<any>> => {
        try {
            const response = await ApiBackend.post(CONTROLLER_URL, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};