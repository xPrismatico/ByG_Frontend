"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import QuoteFilter from "@/components/Quotes/QuoteFilters";
import { QuoteTable, CotizacionUI } from "@/components/Quotes/QuoteTable";
import { QuoteFilters, QuoteDto } from "@/interfaces/Quote";
import { QuoteServices } from "@/services/QuoteServices";
import { CreateQuoteDialog } from "@/components/Quotes/CreateQuoteDialog";
import { PagedResponse } from "@/interfaces/PagedResponse"; // Importante importar la interfaz

export default function QuoteList() {
  // Inicializamos los filtros con valores por defecto para paginación
  const [filters, setFilters] = useState<QuoteFilters>({
    pageNumber: 1,
    pageSize: 10
  });

  // 1. Corregimos el tipo genérico de useQuery para que coincida con el Service
  const { data: pagedData, isLoading, isError } = useQuery<PagedResponse<QuoteDto>>({
    queryKey: ['quotes', filters],
    queryFn: () => QuoteServices.fetchQuotes(filters),
  });

  // 2. Extraemos los items del objeto paginado para mapearlos
  // Notar que ahora usamos pagedData?.items en lugar de pagedData directo
  const cotizacionesMapeadas: CotizacionUI[] = pagedData?.items.map((q) => ({
    id: q.id,
    numero: q.number,
    proveedor: q.supplierName || "Proveedor No Identificado",
    fechaRecepcion: q.date,
    total: q.totalPrice,
    estado: q.status,
    rawQuote: q 
  })) || [];

  if (isLoading) return (
    <div className="p-10 space-y-4">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
  
  if (isError) return (
    <div className="p-10 text-red-500 bg-red-50 rounded-lg border border-red-200">
      <p className="font-bold">Error al cargar cotizaciones</p>
      <p className="text-sm">Por favor, verifica la conexión con el servidor.</p>
    </div>
  );

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Cotizaciones</h1>
          <p className="text-gray-500 mt-1">Administra cotizaciones de proveedores</p>
        </div>
        
        <div className="flex-shrink-0">
          <CreateQuoteDialog />
        </div>
      </div>

      {/* FILTROS */}
      <QuoteFilter onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })} />

      {/* TABLA */}
      {/* Opcional: Podrías pasar pagedData?.totalItems a la tabla si quieres mostrar el contador */}
      <QuoteTable cotizaciones={cotizacionesMapeadas} />

      {/* AQUÍ PODRÍAS AGREGAR TU COMPONENTE DE PAGINACIÓN */}
      {pagedData && pagedData.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
           {/* Botones de Anterior / Siguiente usando setFilters */}
        </div>
      )}

    </div>
  );
}