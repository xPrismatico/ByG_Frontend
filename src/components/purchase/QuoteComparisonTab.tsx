// src/components/Quotes/QuotesComparisonTab.tsx

"use client";

import { useEffect, useState } from "react";
import { QuoteServices } from "@/services/QuoteServices";
import { QuoteDto } from "@/interfaces/Quote";
import { PurchaseItem } from "@/interfaces/purchase";
import { CheckCircle2, XCircle, Building2, AlertCircle, TrendingDown, FileCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
// IMPORTANTE: Importamos el nuevo diálogo
import FormalizeOrderDialog from "@/components/purchase/FormalizeOrderDialog";

interface Props {
  purchaseId: number;
  purchaseItems: PurchaseItem[];
  onQuoteStatusChanged: () => void; // Callback para recargar la página padre
}

export default function QuotesComparisonTab({ purchaseId, onQuoteStatusChanged }: Props) {
  const [quotes, setQuotes] = useState<QuoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  // Estado para controlar el modal de formalización
  const [selectedQuoteForOrder, setSelectedQuoteForOrder] = useState<QuoteDto | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, [purchaseId]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await QuoteServices.fetchQuotes({ purchaseId });
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejador inicial de botones
  const handleActionClick = async (quote: QuoteDto, action: "Aceptar" | "Rechazar") => {
    if (action === "Rechazar") {
       // Rechazo directo
       if (!confirm("¿Estás seguro de rechazar esta cotización?")) return;
       
       setProcessingId(quote.id.toString());
       try {
         await QuoteServices.toggleStatus(Number(quote.id), "Rechazada");
         await fetchQuotes();
       } catch (error) {
         alert("Error al rechazar");
       } finally {
         setProcessingId(null);
       }
    } 
    else if (action === "Aceptar") {
       // Aceptación -> Abre Modal
       setSelectedQuoteForOrder(quote);
    }
  };

  // Callback cuando el modal termina con éxito
  const handleFormalizationSuccess = async () => {
    // 1. Cerramos modal (se hace en el onOpenChange del componente)
    setSelectedQuoteForOrder(null);
    // 2. Recargamos cotizaciones (aparecerá aprobada)
    await fetchQuotes();
    // 3. Avisamos al padre para que habilite el tab de Orden de Compra
    onQuoteStatusChanged();
  };

  if (loading) return <div className="py-12 text-center text-slate-500 animate-pulse">Cargando cotizaciones...</div>;

  if (quotes.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-slate-500">
        <AlertCircle className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No hay cotizaciones cargadas.</p>
      </div>
    );
  }

  // Lógica visual (mejor precio, ya hay aprobada, etc.)
  const lowestPrice = Math.min(...quotes.filter(q => q.totalPrice != null).map(q => q.totalPrice || Infinity));
  const hasApproved = quotes.some(q => q.status === "Aprobada");
  const formatCLP = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {quotes.map((quote) => {
          const isBestPrice = quote.totalPrice === lowestPrice && quote.totalPrice! > 0;
          const isApproved = quote.status === "Aprobada";
          const isRejected = quote.status === "Rechazada";

          return (
            <div 
              key={quote.id} 
              className={cn(
                "flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
                isApproved ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-xl" : 
                isRejected ? "border-slate-200 opacity-60 grayscale bg-slate-50" : 
                "border-[#F2F2F2] hover:shadow-md"
              )}
            >
              {/* Header Card */}
              <div className={cn("p-5 border-b", isApproved ? "bg-emerald-50 border-emerald-100" : "bg-slate-50/50 border-slate-100")}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{quote.number}</span>
                  <div className="flex gap-2">
                    {isBestPrice && !isRejected && !hasApproved && (
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">
                         <TrendingDown className="h-3 w-3" /> MEJOR PRECIO
                      </span>
                    )}
                    {isApproved && (
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-200">
                         <CheckCircle2 className="h-3 w-3" /> GANADORA
                      </span>
                    )}
                    {isRejected && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">RECHAZADA</span>}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-[#1C1C1C] flex items-center gap-2 mb-1">
                  <Building2 className={cn("h-5 w-5", isApproved ? "text-emerald-600" : "text-slate-400")} />
                  {quote.supplierName}
                </h3>
                
                <div className="mt-4">
                  <p className="text-xs text-slate-500 font-semibold uppercase">Total Cotizado</p>
                  <p className={cn("text-2xl font-black", isApproved ? "text-emerald-700" : "text-[#1C1C1C]")}>
                    {quote.totalPrice ? formatCLP(quote.totalPrice) : '$-'}
                  </p>
                </div>
              </div>

              {/* Body Card */}
              <div className="p-5 flex-1 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <FileCheck className="h-3 w-3" /> Desglose
                </h4>
                <ul className="space-y-3">
                  {quote.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start text-sm group">
                      <div className="pr-4">
                        <p className="font-medium text-slate-700">{item.name}</p>
                        <p className="text-xs text-slate-400">{item.quantity} {item.unit} x {formatCLP(item.unitPrice || 0)}</p>
                      </div>
                      <span className="font-semibold text-slate-700 tabular-nums">
                        {formatCLP((item.quantity * (item.unitPrice || 0)))}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer Actions */}
              {!isApproved && !isRejected && !hasApproved && (
                <div className="p-4 bg-white border-t border-slate-100 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleActionClick(quote, "Rechazar")}
                    disabled={processingId !== null}
                    className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-slate-600 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" /> Rechazar
                  </button>
                  
                  <button
                    onClick={() => handleActionClick(quote, "Aceptar")}
                    disabled={processingId !== null}
                    className="flex items-center justify-center gap-2 bg-[#1C1C1C] hover:bg-emerald-600 text-white py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 shadow-lg"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Aceptar Oferta
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Renderizado del Modal de Formalización */}
      {selectedQuoteForOrder && (
        <FormalizeOrderDialog 
          open={!!selectedQuoteForOrder}
          onOpenChange={(open) => !open && setSelectedQuoteForOrder(null)}
          purchaseId={purchaseId}
          quote={selectedQuoteForOrder}
          onSuccess={handleFormalizationSuccess}
        />
      )}
    </>
  );
}