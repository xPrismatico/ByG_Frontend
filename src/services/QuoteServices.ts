import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";

export const QuoteServices = {
  // GET: /api/Quote
  async fetchQuotes(filters?: QuoteFilters): Promise<QuoteDto[]> {
    const response = await ApiBackend.get<ResponseAPI<QuoteDto[]>>("/api/Quote", {
      params: filters,
    });
    return response.data.data;
  },

  // PATCH: /api/Quote/status
  async toggleStatus(id: number, newStatus: string): Promise<string> {
    const response = await ApiBackend.patch<ResponseAPI<string>>("/api/Quote/status", {
      id,
      newStatus,
    });
    return response.data.message;
  },


  async createQuote(data: CreateQuoteDto): Promise<QuoteDto> {
    const response = await ApiBackend.post<ResponseAPI<QuoteDto>>("/api/Quote/create", data);
    return response.data.data;
  }
};

