import { RequestQuoteSupplier } from "./RequestQuoteSupplier";

export interface RequestQuote {
    id: number;
    number: string;
    status: string;
    createdAt: string;
    sentAt: string | null;
    purchaseId: number;
    purchaseDescription: string;
    requestQuoteSuppliers: RequestQuoteSupplier[];
}