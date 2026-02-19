"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, FileText, CalendarDays } from "lucide-react";
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

export function CreateQuoteDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Estados del formulario
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [productos, setProductos] = useState([{ name: "", quantity: 1, unitPrice: 0 }]);

  // Lógica de Mutación (Guardar en backend)
  const createMutation = useMutation({
    mutationFn: QuoteServices.createQuote,
    onSuccess: () => {
      setOpen(false); // Cerramos el modal
      queryClient.invalidateQueries({ queryKey: ["quotes"] }); // Actualizamos la tabla
      
      // Limpiamos el formulario
      setNumero("");
      setFecha("");
      setProductos([{ name: "", quantity: 1, unitPrice: 0 }]);
    },
    onError: (error: any) => {
      console.error("Falló al guardar:", error);
      alert("Hubo un error al guardar: " + error.message);
    }
  });

  // Funciones auxiliares
  const agregarProducto = () => {
    setProductos([...productos, { name: "", quantity: 1, unitPrice: 0 }]);
  };

  const eliminarProducto = (index: number) => {
    const nuevosProductos = productos.filter((_, i) => i !== index);
    setProductos(nuevosProductos);
  };

  const actualizarProducto = (index: number, campo: string, valor: string | number) => {
    const nuevosProductos = [...productos];
    // @ts-ignore
    nuevosProductos[index] = { ...nuevosProductos[index], [campo]: valor };
    setProductos(nuevosProductos);
  };

  const totalCotizacion = productos.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  const handleGuardar = () => {
    if (!numero || !fecha) {
      alert("Por favor, completa los campos obligatorios.");
      return;
    }

    const payload = {
      number: numero,
      status: "Pendiente",
      date: fecha,
      totalPrice: totalCotizacion,
      observations: "", 
      quoteItems: productos.map((p) => ({
        name: p.name,
        quantity: Number(p.quantity),
        unitPrice: Number(p.unitPrice),
        unit: "Unidad"
      })),
      supplierId: 0, 
      purchaseId: 0
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white">
          <Plus className="w-4 h-4 mr-2" /> Nueva Cotización
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[650px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Cotización</DialogTitle>
          <DialogDescription>
            Añade los productos con sus respectivos precios.
          </DialogDescription>
        </DialogHeader>

        {/* --- INICIO DEL FORMULARIO --- */}
        <div className="space-y-6 py-4">
          {/* Fila: N° Cotización y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero">N° de Cotización *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="numero"
                  placeholder="COT-2026-002"
                  className="pl-9"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha de Recepción *</Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  id="fecha"
                  type="date"
                  className="pl-9"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Sección Productos */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Detalle de Productos</h3>
            
            <div className="grid grid-cols-[1fr_80px_120px_40px] gap-2 mb-2 px-1">
              <Label className="text-xs text-gray-500 font-bold uppercase">Descripción</Label>
              <Label className="text-xs text-gray-500 font-bold uppercase text-center">Cant.</Label>
              <Label className="text-xs text-gray-500 font-bold uppercase text-center">Precio</Label>
              <div></div>
            </div>

            {productos.map((producto, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px_120px_40px] gap-2 items-center">
                <Input
                  placeholder="Ej. Cable"
                  value={producto.name}
                  onChange={(e) => actualizarProducto(index, "name", e.target.value)}
                  className="bg-blue-50/50 border-blue-100"
                />
                <Input
                  type="number"
                  min="1"
                  value={producto.quantity}
                  onChange={(e) => actualizarProducto(index, "quantity", Number(e.target.value))}
                  className="text-center"
                />
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500 text-sm">$</span>
                  <Input
                    type="number"
                    min="0"
                    value={producto.unitPrice}
                    onChange={(e) => actualizarProducto(index, "unitPrice", Number(e.target.value))}
                    className="pl-7 text-right"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => eliminarProducto(index)}
                  disabled={productos.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-600 hover:text-gray-900 mt-2"
              onClick={agregarProducto}
            >
              <Plus className="h-4 w-4 mr-2" /> Agregar otro producto
            </Button>
          </div>

          {/* Total */}
          <div className="bg-blue-50 text-blue-900 p-4 rounded-lg flex justify-end items-center gap-4 border border-blue-100">
            <span className="font-bold text-sm uppercase tracking-wider text-blue-800">Total Cotización:</span>
            <span className="text-2xl font-black">${totalCotizacion.toLocaleString("es-CL")}</span>
          </div>
        </div>
        {/* --- FIN DEL FORMULARIO --- */}

        {/* AQUÍ ESTABA TU ERROR ANTES: El footer debe ir ANTES de cerrar DialogContent */}
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            className="bg-[#E33439] hover:bg-[#c12a2f] text-white"
            onClick={handleGuardar}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Guardando..." : "Guardar Cotización"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}