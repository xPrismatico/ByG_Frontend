// src/services/QuoteServices.ts
import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";
import { PagedResponse } from "@/interfaces/PagedResponse";

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

  async fetchQuotes(filters?: QuoteFilters): Promise<QuoteDto[]> {
    const response = await ApiBackend.get<ResponseAPI<PagedResponse<QuoteDto>>>(CONTROLLER_URL, {
      params: filters,
    });
    
    // Accedemos a data.data.items porque data.data es el objeto PagedResponse
    return response.data.data?.items || [];
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