// src/services/QuoteServices.ts
import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";
import { PagedResponse } from "@/interfaces/PagedResponse"; // Importa tu interfaz de paginación

const CONTROLLER_URL = 'api/Quote';

export const QuoteServices = {
  /**
   * Crea una nueva cotización
   */
  createQuote: async (quoteData: CreateQuoteDto): Promise<ResponseAPI<QuoteDto>> => {
    const response = await ApiBackend.post<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/create`, 
      quoteData
    );
    return response.data;
  },

  /**
   * Obtiene la lista de cotizaciones con paginación, búsqueda y orden dinámico
   * @param filters Objeto que contiene status, searchTerm, orderBy, pageNumber, pageSize
   */
  async fetchQuotes(filters?: QuoteFilters): Promise<PagedResponse<QuoteDto>> {
    // Nota: Cambiamos QuoteDto[] por PagedResponse<QuoteDto>
    const response = await ApiBackend.get<ResponseAPI<PagedResponse<QuoteDto>>>(CONTROLLER_URL, {
      params: filters,
    });
    
    // Retornamos el objeto paginado completo (items, totalItems, totalPages, etc.)
    return response.data.data;
  },

  /**
   * Cambia el estado de una cotización (Ej: Aprobada, Rechazada, Pendiente)
   */
  async toggleStatus(id: number, newStatus: string): Promise<string> {
    const response = await ApiBackend.patch<ResponseAPI<string>>(`${CONTROLLER_URL}/status`, {
      id,
      newStatus,
    });
    return response.data.message;
  },

  /**
   * Actualiza los datos de una cotización existente
   */
  updateQuote: async (quoteData: any): Promise<ResponseAPI<QuoteDto>> => {
    const response = await ApiBackend.put<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/update`, 
      quoteData
    );
    return response.data;
  },
};