"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, DollarSign, Truck, Calendar, Pencil } from "lucide-react"
import { PurchaseOrderServices } from "@/services/PurchaseOrderServices"
import { PurchaseOrderDetail } from "@/interfaces/purchaseOrder"

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: PurchaseOrderDetail; // Recibimos la orden actual para pre-llenar
  onSuccess: () => void;
}

export default function EditOrderDialog({ open, onOpenChange, order, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  // Estados (Inicializados con los datos actuales de la orden)
  const [costCenter, setCostCenter] = useState(order.costCenter || "");
  const [paymentForm, setPaymentForm] = useState(order.paymentForm || "");
  const [paymentTerms, setPaymentTerms] = useState(order.paymentTerms || "");
  const [shippingAddress, setShippingAddress] = useState(order.shippingAddress || ""); 
  const [shippingMethod, setShippingMethod] = useState(order.shippingMethod || "");
  
  // Manejo de fechas para inputs type="date"
  const [deliveryDeadline, setDeliveryDeadline] = useState(
    order.deliveryDeadline ? order.deliveryDeadline.split("T")[0] : ""
  );
  const [expectedDate, setExpectedDate] = useState(
    order.expectedDeliveryDate ? order.expectedDeliveryDate.toString() : ""
  );
  
  const [freight, setFreight] = useState<string>(order.freightCharge?.toString() || "0");
  const [discount, setDiscount] = useState<string>(order.discount?.toString() || "0");
  const [observations, setObservations] = useState(order.observations || "");

  // Actualizar estados si cambia la orden seleccionada (por si acaso)
  useEffect(() => {
    if (order) {
        setCostCenter(order.costCenter || "");
        setPaymentForm(order.paymentForm || "");
        setPaymentTerms(order.paymentTerms || "");
        setShippingAddress(order.shippingAddress || "");
        setShippingMethod(order.shippingMethod || "");
        setDeliveryDeadline(order.deliveryDeadline ? order.deliveryDeadline.split("T")[0] : "");
        setExpectedDate(order.expectedDeliveryDate ? order.expectedDeliveryDate.toString() : "");
        setFreight(order.freightCharge?.toString() || "0");
        setDiscount(order.discount?.toString() || "0");
        setObservations(order.observations || "");
    }
  }, [order]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        costCenter,
        paymentForm,
        paymentTerms,
        shippingAddress,
        shippingMethod,
        deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline).toISOString() : undefined,
        expectedDeliveryDate: expectedDate || undefined,
        freightCharge: Number(freight) || 0,
        discount: Number(discount) || 0,
        observations,
      };

      // Llamamos al método UPDATE (PUT)
      const res = await PurchaseOrderServices.update(order.id, payload);
      
      if (res.success) {
        onSuccess();
        onOpenChange(false);
      } else {
        alert(res.message || "Error al actualizar la orden.");
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
             <Pencil className="h-5 w-5 text-blue-600"/>
             Editar Orden de Compra {order.orderNumber}
          </DialogTitle>
          <DialogDescription>
            Modifica los datos logísticos o financieros. Los totales se recalcularán automáticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          
          {/* SECCIÓN 1: DATOS FINANCIEROS */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
             <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <DollarSign className="h-4 w-4"/> Datos Financieros
             </h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Centro de Costo</Label>
                   <Input value={costCenter} onChange={e => setCostCenter(e.target.value)} className="bg-white" />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Condición de Pago</Label>
                   <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contado">Contado</SelectItem>
                        <SelectItem value="30 días">30 días</SelectItem>
                        <SelectItem value="60 días">60 días</SelectItem>
                        <SelectItem value="Contra entrega">Contra entrega</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Costo Flete (+)</Label>
                   <Input type="number" value={freight} onChange={e => setFreight(e.target.value)} className="bg-white" min={0}/>
                </div>
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Descuento (-)</Label>
                   <Input type="number" value={discount} onChange={e => setDiscount(e.target.value)} className="bg-white" min={0}/>
                </div>
             </div>
          </div>

          {/* SECCIÓN 2: LOGÍSTICA */}
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Truck className="h-4 w-4"/> Logística y Entrega
             </h4>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Plazo Máximo Entrega</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/>
                    <Input type="date" value={deliveryDeadline} onChange={e => setDeliveryDeadline(e.target.value)} className="pl-9"/>
                  </div>
                </div>
                <div className="space-y-1">
                   <Label>Método de Envío</Label>
                   <Select value={shippingMethod} onValueChange={setShippingMethod}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Despacho a obra">Despacho a obra</SelectItem>
                        <SelectItem value="Retiro en bodega">Retiro en bodega</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
             </div>

             <div className="space-y-1">
                <Label>Dirección de Envío</Label>
                <Textarea value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} rows={2} />
             </div>
             
             <div className="space-y-1">
                <Label>Observaciones</Label>
                <Textarea value={observations} onChange={e => setObservations(e.target.value)} rows={2} />
             </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}