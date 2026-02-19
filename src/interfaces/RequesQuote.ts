import { RequestQuoteSupplier } from "./RequestQuoteSupplier";

export interface RequestQuote {
    number: string;
    status: string;
    createdAt: string;
    sentAt: string | null;
    purchaseId: number;
    purchaseDescription: string;
    requestQuoteSuppliers: RequestQuoteSupplier[];
}