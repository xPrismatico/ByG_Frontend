export interface QuoteDto {
  id: string | number;
  number: string;
  status: string;
  date: string;
  totalPrice: number | null;
  items: QuoteItemDetailDto[];
  supplierName?: string; 
}

export interface QuoteFilters {
  status?: string;
  searchTerm?: string;
  purchaseId?: number;
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

export interface QuoteItemDetailDto {
  name: string;
  quantity: number;
  unitPrice: number | null;
  unit: string;
}