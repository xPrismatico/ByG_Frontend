"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, FileText, CalendarDays } from "lucide-react";
import { QuoteServices } from "@/services/QuoteServices";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  quote: any; 
}

// ✅ ASEGÚRATE DE QUE DIGA "export function"
export function EditQuoteDialog({ quote }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [productos, setProductos] = useState<any[]>([]);

  useEffect(() => {
    if (open && quote) {
      setNumero(quote.number || quote.Number || "");
      // Convertir fecha de DD-MM-YYYY a YYYY-MM-DD para el input date
      const rawDate = quote.date || quote.Date;
      if (rawDate && rawDate.includes("-")) {
        const [d, m, y] = rawDate.split("-");
        setFecha(`${y}-${m}-${d}`);
      }
      setProductos(quote.items || quote.Items || []);
    }
  }, [open, quote]);

  const updateMutation = useMutation({
    mutationFn: QuoteServices.updateQuote,
    onSuccess: () => {
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
    },
    onError: (error: any) => alert("Error al actualizar: " + error.message),
  });

  const totalCotizacion = productos.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  const handleActualizar = () => {
    const payload = {
      number: numero,
      date: fecha,
      totalPrice: totalCotizacion,
      quoteItems: productos.map(p => ({
        name: p.name || p.Name,
        quantity: Number(p.quantity || p.Quantity),
        unitPrice: Number(p.unitPrice || p.UnitPrice),
        unit: p.unit || p.Unit || "Unidad"
      })),
      supplierId: quote.supplierId || 0,
      purchaseId: quote.purchaseId || 0
    };
    updateMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Edit className="w-4 h-4" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Cotización: {numero}</DialogTitle>
          <DialogDescription>Modifica los datos de la cotización pendiente.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>N° de Cotización</Label>
              <Input value={numero} disabled className="bg-gray-100 text-gray-500" />
            </div>
            <div className="space-y-2">
              <Label>Fecha de Recepción</Label>
              <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Detalle de Productos</h3>
            {productos.map((prod, idx) => (
              <div key={idx} className="grid grid-cols-[1fr_80px_120px] gap-2 items-center">
                <Input 
                  value={prod.name || prod.Name} 
                  onChange={(e) => {
                    const newP = [...productos];
                    newP[idx] = { ...newP[idx], name: e.target.value };
                    setProductos(newP);
                  }}
                />
                <Input 
                  type="number" 
                  value={prod.quantity || prod.Quantity}
                  className="text-center"
                  onChange={(e) => {
                    const newP = [...productos];
                    newP[idx] = { ...newP[idx], quantity: Number(e.target.value) };
                    setProductos(newP);
                  }}
                />
                <Input 
                  type="number" 
                  value={prod.unitPrice || prod.UnitPrice}
                  className="text-right"
                  onChange={(e) => {
                    const newP = [...productos];
                    newP[idx] = { ...newP[idx], unitPrice: Number(e.target.value) };
                    setProductos(newP);
                  }}
                />
              </div>
            ))}
          </div>

          <div className="bg-blue-50 p-4 rounded-lg flex justify-end items-center gap-4">
            <span className="font-bold text-blue-900">Total: ${totalCotizacion.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
          <Button 
            className="bg-[#E33439] hover:bg-[#c12a2f] text-white" 
            onClick={handleActualizar}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Actualizando..." : "Actualizar Cotización"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}