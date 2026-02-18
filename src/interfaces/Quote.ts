export interface QuoteDto {
  id: string | number;
  number: string;
  status: string;
  date: string;
  totalPrice: number | null;
  items: string[];
  // Nota: Deberás agregar el SupplierName a tu DTO en C# para que esto sea real
  supplierName?: string; 
}

export interface QuoteFilters {
  status?: string;
  searchTerm?: string;
  orderBy?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface CreateQuoteItemDto {
  name: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateQuoteDto {
  number: string;
  status: string;
  date: string;
  totalPrice: number;
  quoteItems: CreateQuoteItemDto[];
}