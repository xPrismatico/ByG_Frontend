import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";

// Definimos solo el controlador, Axios ya sabe cuál es el dominio base
const CONTROLLER_URL = '/api/Quote';

export const QuoteServices = {
  // POST: /api/Quote/create
  createQuote: async (quoteData: CreateQuoteDto) => {
    // Usamos ApiBackend en lugar de fetch nativo
    const response = await ApiBackend.post<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/create`, 
      quoteData
    );
    return response.data;
  },

  // GET: /api/Quote
  async fetchQuotes(filters?: QuoteFilters): Promise<QuoteDto[]> {
    const response = await ApiBackend.get<ResponseAPI<QuoteDto[]>>(CONTROLLER_URL, {
      params: filters,
    });
    // Retornamos directamente la data que nos interesa para el componente
    return response.data.data;
  },

  // PATCH: /api/Quote/status
  async toggleStatus(id: number, newStatus: string): Promise<string> {
    const response = await ApiBackend.patch<ResponseAPI<string>>(`${CONTROLLER_URL}/status`, {
      id,
      newStatus,
    });
    return response.data.message;
  },

  // PUT: /api/Quote/update
  updateQuote: async (quoteData: any) => {
    const response = await ApiBackend.put<ResponseAPI<QuoteDto>>(
      `${CONTROLLER_URL}/update`, 
      quoteData
    );
    return response.data;
  },
};