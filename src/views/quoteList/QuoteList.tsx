"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import QuoteFilter from "@/components/Quotes/QuoteFilters";
import { QuoteTable, CotizacionUI } from "@/components/Quotes/QuoteTable";

import { QuoteFilters, QuoteDto } from "@/interfaces/Quote";
import { QuoteServices } from "@/services/QuoteServices";

export default function QuoteList() {
  const [filters, setFilters] = useState<QuoteFilters>({});

  const {
    data: quotesRaw,
    isLoading,
    isError
  } = useQuery<QuoteDto[]>({
    queryKey: ['quotes', filters],
    queryFn: () => QuoteServices.fetchQuotes(filters),
  });

  // Mapeamos los datos de .NET a la estructura que requiere nuestra tabla
  const cotizacionesMapeadas: CotizacionUI[] = quotesRaw?.map((q) => ({
    id: q.id,
    numero: q.number,
    // Como DTO no tiene proveedor aún, usamos un fallback temporal
    proveedor: q.supplierName || "Proveedor No Identificado", 
    fechaRecepcion: q.date,
    total: q.totalPrice,
    estado: q.status,
  })) || [];


  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-10 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">Error</h1>
        <p className="text-gray-600">No se pudieron obtener las cotizaciones.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Cotizaciones</h1>
          <p className="text-gray-500 mt-1">Administra cotizaciones de proveedores</p>
        </div>
        
        <div className="flex-shrink-0">
          <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white">
            <Plus className="w-4 h-4 mr-2" /> Nueva Cotización
          </Button>
        </div>
      </div>

      {/* COMPONENTE DE FILTROS */}
      <QuoteFilter onFilterChange={setFilters} />

      {/* COMPONENTE DE LA TABLA */}
      <QuoteTable cotizaciones={cotizacionesMapeadas} />

    </div>
  );
}