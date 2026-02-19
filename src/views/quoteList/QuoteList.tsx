"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import QuoteFilter from "@/components/Quotes/QuoteFilters";
import { QuoteTable, CotizacionUI } from "@/components/Quotes/QuoteTable"; // Asegurate de la ruta
import { QuoteFilters, QuoteDto } from "@/interfaces/Quote";
import { QuoteServices } from "@/services/QuoteServices";
import { CreateQuoteDialog } from "@/components/Quotes/CreateQuoteDialog";

export default function QuoteList() {
  const [filters, setFilters] = useState<QuoteFilters>({});

  const { data: quotesRaw, isLoading, isError } = useQuery<QuoteDto[]>({
    queryKey: ['quotes', filters],
    queryFn: () => QuoteServices.fetchQuotes(filters),
  });

  // Mapeamos los datos
  const cotizacionesMapeadas: CotizacionUI[] = quotesRaw?.map((q) => ({
    id: q.id,
    numero: q.number,
    proveedor: q.supplierName || "Proveedor No Identificado",
    fechaRecepcion: q.date,
    total: q.totalPrice,
    estado: q.status,
    
    // ✅ ESTA ES LA LÍNEA MÁGICA: Guardamos la data original para el modal VER
    rawQuote: q 
  })) || [];

  if (isLoading) return <div className="p-10"><Skeleton className="h-10 w-full mb-4"/><Skeleton className="h-64 w-full"/></div>;
  if (isError) return <div className="p-10 text-red-500">Error al cargar cotizaciones</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Cotizaciones</h1>
          <p className="text-gray-500 mt-1">Administra cotizaciones de proveedores</p>
        </div>
        
        {/* Aquí llamamos al componente que arreglamos arriba */}
        <div className="flex-shrink-0">
          <CreateQuoteDialog />
        </div>
      </div>

      <QuoteFilter onFilterChange={setFilters} />
      <QuoteTable cotizaciones={cotizacionesMapeadas} />

    </div>
  );
}