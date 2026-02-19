import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5280/api/Quote';

export const QuoteServices = {

    createQuote: async (quoteData: any) => {
    // Asegúrate de que la URL coincida con tu backend de C#
    const response = await fetch(`${API_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(quoteData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Error al crear la cotización");
    }

    return response.json();
  },

  // GET: /api/Quote
  async fetchQuotes(filters?: QuoteFilters): Promise<QuoteDto[]> {
    const response = await ApiBackend.get<ResponseAPI<QuoteDto[]>>(`${API_URL}`, {
      params: filters,
    });
    return response.data.data;
  },

  // PATCH: /api/Quote/status
  async toggleStatus(id: number, newStatus: string): Promise<string> {
    const response = await ApiBackend.patch<ResponseAPI<string>>(`${API_URL}/status`, {
      id,
      newStatus,
    });
    return response.data.message;
  },

  // src/services/QuoteServices.ts
updateQuote: async (quoteData: any) => {
  const response = await fetch(`${API_URL}/update`, {
    method: "PUT", // Tu controlador usa [HttpPut("update")]
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quoteData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar");
  }
  return response.json();
},

};

