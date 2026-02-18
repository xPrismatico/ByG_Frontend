import { ApiBackend } from '@/clients/Axios';
import { ResponseAPI } from '@/interfaces/ResponseAPI';
import {
    SupplierSummary,
    SupplierDetail,
    SupplierCreate,
    SupplierUpdate
} from '@/interfaces/supplier';
import { AxiosError } from 'axios';

// Definimos la ruta base para este controlador [cite: 18]
const CONTROLLER_URL = '/api/supplier';

/**
 * Función auxiliar para manejar errores de Axios y asegurar que 
 * siempre devolvemos una estructura ResponseAPI, incluso si falla la red.
 */
const handleApiError = (error: unknown): ResponseAPI<any> => {
    if (error instanceof AxiosError && error.response?.data) {
        // El backend devolvió un ApiResponse con errores (ej. 404, 409) [cite: 70, 94]
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
     * Obtiene la lista resumida de todos los proveedores[cite: 24, 25].
     * @returns Una promesa con la respuesta genérica conteniendo un arreglo de SupplierSummary.
     */
    getSuppliers: async (): Promise<ResponseAPI<SupplierSummary[]>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<SupplierSummary[]>>(CONTROLLER_URL);
            return response.data;
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Obtiene el detalle completo de un proveedor por su ID[cite: 52].
     * @param id Identificador único del proveedor[cite: 53].
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
     * Crea un nuevo proveedor en el sistema[cite: 83].
     * @param data Objeto con la información requerida (SupplierCreate).
     */
    createSupplier: async (data: SupplierCreate): Promise<ResponseAPI<SupplierDetail>> => {
        try {
            const response = await ApiBackend.post<ResponseAPI<SupplierDetail>>(CONTROLLER_URL, data);
            return response.data; // Retorna 201 Created con el detalle [cite: 104]
        } catch (error) {
            return handleApiError(error);
        }
    },

    /**
     * Actualiza la información de un proveedor existente[cite: 114].
     * @param id Identificador único del proveedor.
     * @param data Objeto con la información a actualizar (SupplierUpdate)[cite: 115].
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
     * Cambia el estado (Activo/Inactivo) de un proveedor[cite: 153].
     * @param id Identificador único del proveedor.
     * @returns Respuesta genérica donde 'data' es un booleano con el nuevo estado[cite: 172].
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
     * Elimina definitivamente un proveedor del sistema[cite: 177].
     * Precaución: Fallará (409 Conflict) si tiene historial asociado[cite: 184].
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