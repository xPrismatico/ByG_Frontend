"use client";

import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, FileText, CalendarDays, Loader2 } from "lucide-react";
import { QuoteServices } from "@/services/QuoteServices";
import { SupplierService } from "@/services/SupplierServices";
import { SupplierSummary } from "@/interfaces/supplier";
// Importamos la interfaz para tipar los items que vienen de la compra
import { PurchaseItem } from "@/interfaces/purchase";

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Props {
    purchaseId?: number;
    onSuccess?: () => void;
    // Items opcionales para pre-llenar
    initialItems?: PurchaseItem[]; 
}

export function CreateQuoteDialog({ purchaseId, onSuccess, initialItems }: Props) {
  const [open, setOpen] = useState(false);
  
  const [numero, setNumero] = useState("");
  const [fecha, setFecha] = useState("");
  const [supplierId, setSupplierId] = useState<string>("");
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([]);
  
  // Agregamos 'unit' al estado para manejar la unidad de medida
  const [productos, setProductos] = useState([
    { name: "", quantity: 1, unitPrice: 0, unit: "Unidad" }
  ]);

  // Efecto al abrir el modal
  useEffect(() => {
      if(open) {
          // 1. Cargar proveedores
          const fetchSuppliers = async () => {
             const res = await SupplierService.getSuppliers({ isActive: true });
             if(res.success && res.data) {
                 setSuppliers(res.data.items);
             }
          }
          fetchSuppliers();

          // 2. LÓGICA DE PRE-LLENADO
          // Si hay purchaseId y vienen items iniciales, los usamos.
          if (purchaseId && initialItems && initialItems.length > 0) {
            const mappedItems = initialItems.map(item => ({
                name: item.name, // Nombre del producto
                quantity: item.quantity, // Cantidad solicitada
                unitPrice: 0, // Precio parte en 0 para que el proveedor lo llene
                unit: item.unit // Mantenemos la unidad (ej: Saco, M3)
            }));
            setProductos(mappedItems);
          } else {
            // Si es desde la página general o no hay items, reseteamos a uno vacío
            setProductos([{ name: "", quantity: 1, unitPrice: 0, unit: "Unidad" }]);
          }
      }
  }, [open, purchaseId, initialItems]);

  const createMutation = useMutation({
    mutationFn: QuoteServices.createQuote,
    onSuccess: () => {
      setOpen(false);
      setNumero("");
      setFecha("");
      setSupplierId("");
      // Reset a vacío por defecto
      setProductos([{ name: "", quantity: 1, unitPrice: 0, unit: "Unidad" }]);
      
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error("Falló al guardar:", error);
      alert("Hubo un error al guardar: " + (error.response?.data?.message || error.message));
    }
  });

  const agregarProducto = () => {
    setProductos([...productos, { name: "", quantity: 1, unitPrice: 0, unit: "Unidad" }]);
  };

  const eliminarProducto = (index: number) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const actualizarProducto = (index: number, campo: string, valor: string | number) => {
    const nuevos = [...productos];
    // @ts-ignore
    nuevos[index] = { ...nuevos[index], [campo]: valor };
    setProductos(nuevos);
  };

  const totalCotizacion = productos.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  const handleGuardar = () => {
    if (!numero || !fecha || !supplierId) {
      alert("Por favor, completa N° Cotización, Fecha y Proveedor.");
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
        unit: p.unit || "Unidad" // Usamos la unidad del estado
      })),
      supplierId: Number(supplierId), 
      purchaseId: purchaseId || 0
    };

    createMutation.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white shadow-md">
          <Plus className="w-4 h-4 mr-2" /> 
          {purchaseId ? "Subir Cotización" : "Nueva Cotización"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[750px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {purchaseId ? "Subir Cotización a Compra" : "Registrar Cotización Manual"}
          </DialogTitle>
          <DialogDescription>
            {purchaseId 
                ? "Los productos se han precargado desde la solicitud. Ajusta los precios según el documento."
                : "Ingresa los datos del documento recibido por el proveedor."
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proveedor *</Label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar Proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                      {suppliers.map(s => (
                          <SelectItem key={s.id} value={s.id.toString()}>{s.businessName}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
               <Label>Fecha Recepción *</Label>
               <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
              <Label>N° Folio Cotización (Proveedor) *</Label>
              <Input 
                  value={numero} 
                  onChange={(e) => setNumero(e.target.value)} 
                  placeholder="Ej: COT-8842" 
              />
          </div>

          <div className="space-y-3 pt-2 border-t">
            <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">Items Cotizados</h3>
            
            {/* Grid ajustado para incluir la Unidad */}
            <div className="grid grid-cols-[1fr_80px_80px_100px_40px] gap-2 px-1">
              <Label className="text-xs text-gray-500">Descripción</Label>
              <Label className="text-xs text-gray-500 text-center">Unidad</Label>
              <Label className="text-xs text-gray-500 text-center">Cant.</Label>
              <Label className="text-xs text-gray-500 text-center">Precio Unit.</Label>
            </div>

            {productos.map((producto, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px_80px_100px_40px] gap-2 items-center">
                <Input
                  placeholder="Producto..."
                  value={producto.name}
                  onChange={(e) => actualizarProducto(index, "name", e.target.value)}
                />
                
                {/* Campo Unidad Editable */}
                <Input
                  placeholder="Unidad"
                  value={producto.unit}
                  onChange={(e) => actualizarProducto(index, "unit", e.target.value)}
                  className="text-center bg-gray-50"
                />

                <Input
                  type="number"
                  min="1"
                  value={producto.quantity}
                  onChange={(e) => actualizarProducto(index, "quantity", Number(e.target.value))}
                  className="text-center"
                />
                <Input
                  type="number"
                  min="0"
                  value={producto.unitPrice}
                  onChange={(e) => actualizarProducto(index, "unitPrice", Number(e.target.value))}
                  className="text-right"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-600 hover:bg-red-50"
                  onClick={() => eliminarProducto(index)}
                  // Permitimos borrar aunque sea el último (si quieren dejarlo vacío) o limitar a 1
                  // disabled={productos.length === 1} 
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full border-dashed text-slate-500 hover:text-slate-800 mt-2"
              onClick={agregarProducto}
            >
              <Plus className="h-4 w-4 mr-2" /> Agregar ítem
            </Button>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg flex justify-between items-center border">
            <span className="font-medium text-sm text-slate-600">Total Neto Estimado:</span>
            <span className="text-xl font-bold text-slate-900">${totalCotizacion.toLocaleString("es-CL")}</span>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            className="bg-[#E33439] hover:bg-[#c12a2f] text-white"
            onClick={handleGuardar}
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
            Guardar
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}