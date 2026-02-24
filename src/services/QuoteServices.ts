// src/services/QuoteServices.ts
import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";

const CONTROLLER_URL = '/api/Quote';

// Asegúrate de que diga 'export const' claramente
export const QuoteServices = {
  createQuote: async (quoteData: CreateQuoteDto) => {
    const response = await ApiBackend.post<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/create`, 
      quoteData
    );
    return response.data;
  },

  async fetchQuotes(filters?: QuoteFilters): Promise<QuoteDto[]> {
    const response = await ApiBackend.get<ResponseAPI<QuoteDto[]>>(CONTROLLER_URL, {
      params: filters,
    });
    return response.data.data;
  },

  async toggleStatus(id: number, newStatus: string): Promise<string> {
    const response = await ApiBackend.patch<ResponseAPI<string>>(`${CONTROLLER_URL}/status`, {
      id,
      newStatus,
    });
    return response.data.message;
  },

  updateQuote: async (quoteData: any) => {
    const response = await ApiBackend.put<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/update`, 
      quoteData
    );
    return response.data;
  },
};