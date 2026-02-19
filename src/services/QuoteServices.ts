import { ApiBackend } from "@/clients/Axios";
import { ResponseAPI } from "@/interfaces/ResponseAPI";
import { CreateQuoteDto, QuoteDto, QuoteFilters } from "@/interfaces/Quote";

export const QuoteServices = {

    createQuote: async (quoteData: any) => {
    // Asegúrate de que la URL coincida con tu backend de C#
    const response = await fetch("http://localhost:5280/api/quote/create", {
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

  // src/services/QuoteServices.ts
updateQuote: async (quoteData: any) => {
  const response = await fetch("http://localhost:5280/api/Quote/update", {
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

