"use client";

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";

interface Props {
  quote: any; 
}

export function ViewQuoteDialog({ quote }: Props) {
  const number = quote?.number || quote?.Number || "Sin número";
  const date = quote?.date || quote?.Date || "--";
  const status = quote?.status || quote?.Status || "Desconocido";
  const totalPrice = quote?.totalPrice || quote?.TotalPrice || 0;
  const items = quote?.items || quote?.Items || [];
  
  // Capturamos las observaciones (si existen)
  const observations = quote?.observations || quote?.Observations || "";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" /> Ver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl">Detalle de Cotización: {number}</DialogTitle>
        </DialogHeader>

        {/* Info General */}
        <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100 my-2">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Fecha</p>
            <p className="text-sm">{date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Estado</p>
            <span className="text-sm px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              {status}
            </span>
          </div>
        </div>

        {/* Tabla de Productos */}
        <div className="mt-2">
          <h4 className="text-sm font-bold mb-3">Productos Cotizados</h4>
          <div className="border rounded-md overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-2 text-left">Descripción</th>
                  <th className="p-2 text-center">Cant.</th>
                  <th className="p-2 text-right">Unitario</th>
                  <th className="p-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                      No hay productos registrados.
                    </td>
                  </tr>
                ) : (
                  items.map((item: any, index: number) => {
                    const itemName = item?.name || item?.Name || "Producto";
                    const itemQty = item?.quantity || item?.Quantity || 0;
                    const itemUnit = item?.unit || item?.Unit || "";
                    const itemPrice = item?.unitPrice || item?.UnitPrice || 0;

                    return (
                      <tr key={index} className="border-b last:border-0 hover:bg-gray-50/50">
                        <td className="p-2 font-medium">{itemName}</td>
                        <td className="p-2 text-center">{itemQty} {itemUnit}</td>
                        <td className="p-2 text-right">${itemPrice.toLocaleString('es-CL')}</td>
                        <td className="p-2 text-right font-semibold">
                          ${(itemQty * itemPrice).toLocaleString('es-CL')}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* NUEVO: Bloque de Observaciones */}
        {observations && (
          <div className="mt-4 bg-yellow-50/50 border border-yellow-100 p-3 rounded-md">
            <h4 className="text-xs font-bold text-yellow-800 uppercase flex items-center gap-1 mb-1">
              <MessageSquare className="w-3 h-3" /> Observaciones
            </h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{observations}</p>
          </div>
        )}

        {/* Total Final */}
        <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-bold text-gray-500">TOTAL COTIZACIÓN:</span>
          <span className="text-2xl font-black text-[#E33439]">
            ${totalPrice.toLocaleString('es-CL')}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}