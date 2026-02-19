// src/interfaces/PagedResponse.ts

export interface PagedResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}