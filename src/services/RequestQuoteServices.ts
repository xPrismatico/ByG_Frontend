import { ApiBackend } from "@/clients/Axios";
import { RequestQuote } from "@/interfaces/RequesQuote";
import { ResponseAPI } from "@/interfaces/ResponseAPI";

const CONTROLLER_URL =  '/api/Request';

export const requestQuoteService = {
    /**
     * Obtiene la lista paginada y filtrada de solicitudes de cotización
     */
    getAll: async (
        status?: string,
        searchTerm?: string,
        orderBy?: string,
        purchaseId?: number | string, // <--- Importante: parámetro agregado
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<ResponseAPI<RequestQuote[]>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<RequestQuote[]>>(CONTROLLER_URL, {
                params: {
                    status,
                    searchTerm,
                    orderBy,
                    purchaseId, // <--- Se envía al backend
                    pageNumber,
                    pageSize
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching request quotes:", error);
            throw error;
        }
    },

    // El método getById que también necesitas para el endpoint /api/Request/{id}
    getById: async (id: number): Promise<ResponseAPI<RequestQuote>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<RequestQuote>>(`${CONTROLLER_URL}/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener la solicitud ${id}:`, error);
            throw error;
        }
    },

    /**
     * Genera el PDF (Retorna el blob para descargar o visualizar)
     */
    generatePdf: async (payload: any): Promise<any> => {
        // Importante: No usamos responseType: 'blob' si el backend devuelve un string Base64.
        // Si el backend devuelve byte[] directamente, Axios suele convertirlo a string.
        const response = await ApiBackend.post(`${CONTROLLER_URL}/create`, payload);
        return response.data; 
    }
};