import { ApiBackend } from "@/clients/Axios";
import { RequestQuote } from "@/interfaces/RequesQuote";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { PagedResponse } from "@/interfaces/PagedResponse"; // Asegúrate de tener esta interfaz

const CONTROLLER_URL = 'api/Request';

export const requestQuoteService = {
    /**
     * Obtiene la lista paginada y filtrada de solicitudes de cotización
     */
    getAll: async (
        status?: string,
        searchTerm?: string,
        orderBy?: string,
        purchaseId?: number | string,
        pageNumber: number = 1,
        pageSize: number = 10
    ): Promise<ResponseAPI<PagedResponse<RequestQuote>>> => { // Cambio: PagedResponse en lugar de []
        try {
            const response = await ApiBackend.get<ResponseAPI<PagedResponse<RequestQuote>>>(CONTROLLER_URL, {
                params: {
                    status,
                    searchTerm,
                    orderBy,
                    purchaseId, 
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
     * Genera el PDF (Si el backend devuelve byte[], llega como string o arraybuffer)
     */
    generatePdf: async (payload: any): Promise<any> => {
        const response = await ApiBackend.post(`${CONTROLLER_URL}/create`, payload);
        return response.data; 
    },

    /**
     * Descarga el PDF como Blob
     */
    downloadPdf: async (requestQuoteId: number): Promise<Blob> => {
        const urlFinal = `${CONTROLLER_URL}/${requestQuoteId}/pdf`;
        
        const response = await ApiBackend.get(urlFinal, {
            responseType: "blob",
            headers: { Accept: "application/pdf" },
        });

        return response.data as Blob;
    }
};