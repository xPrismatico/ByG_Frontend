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

const CONTROLLER_URL = 'api/purchase';

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

export const PurchaseServices = {
    /**
     * Obtiene la lista paginada de compras.
     * El backend ahora usa ApplySearch (PurchaseNumber, ProjectName, Requester) 
     * y ApplySorting (Default: RequestDate:desc).
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

            const response = await ApiBackend.get<ResponseAPI<PagedResponse<PurchaseSummary>>>(CONTROLLER_URL, { 
                params: cleanParams 
            });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    getPurchaseById: async (id: number): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<PurchaseDetail>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    createPurchase: async (data: PurchaseCreate): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<PurchaseDetail>>(CONTROLLER_URL, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    updatePurchase: async (id: number, data: PurchaseUpdate): Promise<ResponseAPI<PurchaseDetail>> => {
        try {
            const response = await ApiBackend.put<ResponseAPI<PurchaseDetail>>(`${CONTROLLER_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Actualiza el estado enviando un string JSON-encoded.
     */
    updatePurchaseStatus: async (id: number, newStatus: string): Promise<ResponseAPI<string>> => {
        try {
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

    deletePurchase: async (id: number): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.delete<ResponseAPI<string>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Vincula proveedores a una solicitud de compra.
     */
    addSuppliers: async (purchaseId: number, supplierIds: number[]): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<string>>(
                `${CONTROLLER_URL}/${purchaseId}/add-suppliers`, 
                supplierIds
            );
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};