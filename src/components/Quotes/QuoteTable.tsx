"use client";

import { Clock3, XCircle, CheckCircle2, Eye, Edit, Download } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ViewQuoteDialog } from "./ViewQuoteDialog";
import { EditQuoteDialog } from "./EditQuoteDialog";

// 1. Agregamos rawQuote a la interfaz para que TypeScript no se queje
export interface CotizacionUI {
  id: string | number;
  numero: string;
  proveedor: string;
  fechaRecepcion: string;
  total: number | null;
  estado: string;
  rawQuote?: any; // <-- Dato original del backend
}

interface QuoteTableProps {
  cotizaciones: CotizacionUI[];
}

const renderEstadoBadge = (rawEstado: string) => {
  const estado = rawEstado?.trim().toLowerCase();
  
  switch (estado) {
    case "pendiente":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 gap-1.5 font-normal text-sm px-2.5 py-1 rounded-full">
          <Clock3 className="w-3.5 h-3.5" /> Pendiente
        </Badge>
      );
    case "rechazada":
      return (
        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50 gap-1.5 font-normal text-sm px-2.5 py-1 rounded-full">
          <XCircle className="w-3.5 h-3.5" /> Rechazada
        </Badge>
      );
    case "aprobada":
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1.5 font-normal text-sm px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5" /> Aprobada
        </Badge>
      );
    default:
      return <Badge variant="outline">{rawEstado}</Badge>;
  }
};

export function QuoteTable({ cotizaciones }: QuoteTableProps) {
  return (
    <Card className="border-gray-100 shadow-sm overflow-hidden w-full">
      <CardHeader className="border-b border-gray-50 pb-4">
        <CardTitle className="text-lg text-gray-800">Cotizaciones</CardTitle>
        <CardDescription className="text-gray-500">
          {cotizaciones.length} cotizaciones encontradas
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="font-bold text-gray-700 text-sm">N° Cotización</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Proveedor</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Fecha</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Total</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Estado</TableHead>
              <TableHead className="text-right font-bold text-gray-700 text-sm"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cotizaciones.length > 0 ? (
              cotizaciones.map((cot) => (
                <TableRow key={cot.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{cot.numero}</TableCell>
                  <TableCell className="text-gray-600">{cot.proveedor}</TableCell>
                  <TableCell className="text-gray-600">{cot.fechaRecepcion}</TableCell>
                  <TableCell className="text-gray-900 font-medium">
                    {cot.total ? `$${cot.total.toLocaleString("es-CL")}` : "N/A"}
                  </TableCell>
                  <TableCell>{renderEstadoBadge(cot.estado)}</TableCell>
                  
                  {/* 2. AQUÍ ESTABA EL ERROR: Solo dejamos un TableCell principal */}
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2 items-center">
                      
                      {/* 3. Pasamos el rawQuote al botón VER */}
                      <ViewQuoteDialog quote={cot.rawQuote} />
                      
                      {/* Ocultar "Editar" si ya está Aprobada o Rechazada */}
                        {cot.estado?.toLowerCase() === "pendiente" && (
                        <EditQuoteDialog quote={cot.rawQuote} />
                        )}

                      <Button variant="outline" size="sm" className="h-8 w-8 px-0 text-gray-600 border-gray-200 hover:bg-gray-50" title="Descargar PDF">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No se encontraron cotizaciones.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}