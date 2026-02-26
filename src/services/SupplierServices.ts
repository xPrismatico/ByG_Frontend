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

const CONTROLLER_URL = 'api/supplier';

const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        return error.response.data as ResponseAPI<any>;
    }
    return {
        success: false,
        message: 'Error de conexión con el servidor.',
        data: null,
        errors: ['Ocurrió un error inesperado.'],
    };
};

export const SupplierService = {
    /**
     * Obtiene la lista paginada de proveedores.
     * El backend ahora usa ApplySearch y ApplySorting dinámico.
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
            const cleanParams = params ? Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined && v !== null)
            ) : {};

            const response = await ApiBackend.get<ResponseAPI<PagedResponse<SupplierSummary>>>(CONTROLLER_URL, { 
                params: cleanParams 
            });
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    getSupplierById: async (id: number): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<SupplierDetail>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    createSupplier: async (data: SupplierCreate): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<SupplierDetail>>(CONTROLLER_URL, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    updateSupplier: async (id: number, data: SupplierUpdate): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.put<ResponseAPI<SupplierDetail>>(`${CONTROLLER_URL}/${id}`, data);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    toggleSupplierStatus: async (id: number): Promise<ResponseAPI<boolean>> => {
        try {
            // El backend invierte el estado automáticamente
            const response = await ApiBackend.patch<ResponseAPI<boolean>>(`${CONTROLLER_URL}/${id}/toggle-status`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    deleteSupplier: async (id: number): Promise<ResponseAPI<string>> => {
        try {
            const response = await ApiBackend.delete<ResponseAPI<string>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    }
};