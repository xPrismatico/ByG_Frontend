import { ApiBackend } from '@/clients/Axios';
import { PagedResponse } from '@/interfaces/PagedResponse';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import { 
    PurchaseOrderSummary, 
    PurchaseOrderFilters,
    PurchaseOrderCreate,
    PurchaseOrderDetail,
    PurchaseOrderUpdate
} from '@/interfaces/purchaseOrder';
import { AxiosError } from 'axios';

const CONTROLLER_URL = 'api/PurchaseOrder'; 

const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        if (error.response.data instanceof Blob) {
            return { 
                success: false, 
                message: "Error al procesar el archivo del servidor.", 
                data: null, 
                errors: [] 
            };
        }
        return error.response.data as ResponseAPI<any>;
    }
    return {
        success: false,
        message: 'Error de conexión con el servicio de órdenes.',
        data: null,
        errors: ['Ocurrió un error inesperado.'],
    };
};

export const PurchaseOrderServices = {
    
    /**
     * Obtiene el listado paginado de OC.
     * Soporta los nuevos filtros genéricos del Backend.
     */
    getAll: async (params: PurchaseOrderFilters): Promise<ResponseAPI<PagedResponse<PurchaseOrderSummary>>> => {
        try {
            // Filtramos parámetros para no enviar campos vacíos a la URL
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
            );

            const response = await ApiBackend.get<ResponseAPI<PagedResponse<PurchaseOrderSummary>>>(CONTROLLER_URL, { 
                params: cleanParams 
            });
            return response.data;
        } catch (error) { 
            return handleApiError(error); 
        }
    },

    /**
     * Obtiene el detalle completo de una Orden de Compra (incluye ítems y proveedor).
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
     * Genera una nueva Orden de Compra y actualiza los estados de la Cotización y Compra.
     */
    create: async (data: PurchaseOrderCreate): Promise<ResponseAPI<PurchaseOrderDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<PurchaseOrderDetail>>(CONTROLLER_URL, data);
            return response.data;
        } catch (error) { 
            return handleApiError(error); 
        }
    },

    /**
     * Actualiza datos logísticos o de cabecera de la OC.
     */
    update: async (id: number, data: PurchaseOrderUpdate): Promise<ResponseAPI<PurchaseOrderDetail>> => {
        try {
            const response = await ApiBackend.put<ResponseAPI<PurchaseOrderDetail>>(`${CONTROLLER_URL}/${id}`, data);
            return response.data;
        } catch (error) { 
            return handleApiError(error); 
        }
    },

    /**
     * Actualiza el estado de la OC (Ej: "Enviada", "Recibida", "Pagada").
     */
    updateStatus: async (id: number, newStatus: string): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.patch<ResponseAPI<string>>(
                `${CONTROLLER_URL}/${id}/status`, 
                JSON.stringify(newStatus), 
                { headers: { 'Content-Type': 'application/json' } }
            );
            return response.data;
        } catch (error) { 
            return handleApiError(error); 
        }
    },

    /**
     * Descarga el PDF generado de la Orden de Compra.
     */
    downloadPdf: async (id: number): Promise<Blob | null> => {
        try {
            const response = await ApiBackend.get(`${CONTROLLER_URL}/${id}/pdf`, { 
                responseType: 'blob',
                headers: { 'Accept': 'application/pdf' }
            });
            return response.data as Blob;
        } catch (error) {
            console.error("Error downloading OC PDF", error);
            return null;
        }
    },
};