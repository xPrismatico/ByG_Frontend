import { ApiBackend } from "@/clients/Axios";
import { RequestQuote } from "@/interfaces/RequesQuote";
import { ResponseAPI } from "@/interfaces/ResponseAPI";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280/api/Request';

export const requestQuoteService = {
    /**
     * Obtiene la lista paginada y filtrada de solicitudes de cotización
     */
    getAll: async (
        status?: string,
        searchTerm?: string,
        orderBy?: string,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<ResponseAPI<RequestQuote[]>> => {
        try {
            const response = await ApiBackend.get<ResponseAPI<RequestQuote[]>>(`${API_URL}`, {
                params: {
                    status,
                    searchTerm,
                    orderBy,
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

    /**
     * Genera el PDF (Retorna el blob para descargar o visualizar)
     */
    generatePdf: async (data: any): Promise<Blob> => {
        const response = await ApiBackend.post(`${API_URL}/create`, data, {
            responseType: 'blob' // Importante para manejar arreglos de bytes/PDF
        });
        return response.data;
    }
};