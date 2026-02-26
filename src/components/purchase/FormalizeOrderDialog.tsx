"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, DollarSign, Truck, Calendar, Building2 } from "lucide-react"
import { PurchaseOrderServices } from "@/services/PurchaseOrderServices"
import { QuoteDto } from "@/interfaces/Quote"

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  purchaseId: number;
  quote: QuoteDto; // La cotización que se está aceptando
  onSuccess: () => void;
}

export default function FormalizeOrderDialog({ open, onOpenChange, purchaseId, quote, onSuccess }: Props) {
  const [loading, setLoading] = useState(false);
  
  // --- Estados del Formulario ---
  const [costCenter, setCostCenter] = useState("");
  const [paymentForm, setPaymentForm] = useState("Transferencia");
  const [paymentTerms, setPaymentTerms] = useState("30 días");
  const [shippingAddress, setShippingAddress] = useState("Dirección de la Obra (Por defecto)"); 
  const [shippingMethod, setShippingMethod] = useState("Despacho a obra");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  
  // Montos adicionales
  const [freight, setFreight] = useState<string>("0");
  const [discount, setDiscount] = useState<string>("0");
  const [observations, setObservations] = useState("");

  const handleSubmit = async () => {
    // Validación básica frontend
    if (!costCenter.trim()) {
      alert("Debes ingresar un Centro de Costo para formalizar la orden.");
      return;
    }

    setLoading(true);
    try {
      // Construimos el objeto según la interfaz PurchaseOrderCreate
      const payload = {
        purchaseId,
        quoteId: Number(quote.id),
        costCenter,
        paymentForm,
        paymentTerms,
        shippingAddress,
        shippingMethod,
        // Convertimos fechas vacías a undefined
        deliveryDeadline: deliveryDeadline ? new Date(deliveryDeadline).toISOString() : undefined,
        expectedDeliveryDate: expectedDate || undefined, // Backend espera DateOnly (string YYYY-MM-DD funciona)
        
        freightCharge: Number(freight) || 0,
        discount: Number(discount) || 0,
        observations,
        
        // Datos fijos o del usuario actual (esto idealmente viene de un contexto de auth)
        approverName: "Usuario Actual", // TODO: Obtener del contexto de Auth
        approverRole: "Gestor/Autorizador" // TODO: Obtener del contexto de Auth
      };

      const res = await PurchaseOrderServices.create(payload);
      
      if (res.success) {
        onSuccess(); // Recargar datos en el padre
        onOpenChange(false);
      } else {
        alert(res.message || "Error al generar la orden de compra.");
      }
    } catch (error) {
      console.error(error);
      alert("Error inesperado al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
             <Building2 className="h-5 w-5 text-blue-600"/>
             Formalizar Orden de Compra
          </DialogTitle>
          <DialogDescription>
            Estás aceptando la oferta de <strong>{quote.supplierName}</strong>. Completa los datos para generar el documento.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
             <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><DollarSign className="h-4 w-4"/> Datos Financieros</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Centro de Costo <span className="text-red-500">*</span></Label>
                   <Input value={costCenter} onChange={e => setCostCenter(e.target.value)} placeholder="Ej: CC-2026-OBRA-01" className="bg-white" />
                </div>
                <div className="space-y-1">
                   <Label className="text-xs font-semibold text-slate-500 uppercase">Condición de Pago</Label>
                   <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                      <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contado">Contado</SelectItem>
                        <SelectItem value="30 días">30 días</SelectItem>
                        <SelectItem value="60 días">60 días</SelectItem>
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

          <div className="space-y-4">
             <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Truck className="h-4 w-4"/> Logística</h4>
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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-slate-900 text-white hover:bg-slate-800">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generar Orden de Compra
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}