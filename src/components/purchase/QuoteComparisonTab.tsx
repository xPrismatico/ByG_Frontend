"use client";

import { useEffect, useState } from "react";
import { QuoteServices } from "@/services/QuoteServices";
import { QuoteDto } from "@/interfaces/Quote";
import { PurchaseItem } from "@/interfaces/purchase";
import { CheckCircle2, XCircle, Building2, AlertCircle, TrendingDown, FileCheck, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import FormalizeOrderDialog from "@/components/purchase/FormalizeOrderDialog";
import { CreateQuoteDialog } from "@/components/Quotes/CreateQuoteDialog";

//  1. Importamos el hook de autenticación
import { useAuth } from "@/contexts/AuthContext"; 

interface Props {
  purchaseId: number;
  purchaseItems: PurchaseItem[];
  onQuoteStatusChanged: () => void;
}

export default function QuotesComparisonTab({ purchaseId, purchaseItems, onQuoteStatusChanged }: Props) {
  //  2. Obtenemos el usuario actual del contexto
  const { user } = useAuth();

  const [quotes, setQuotes] = useState<QuoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedQuoteForOrder, setSelectedQuoteForOrder] = useState<QuoteDto | null>(null);

  //  3. Definimos la lógica de permisos:
  // Solo Admin y AutorizadorCompras pueden ver los botones de decisión.
  const canDecide = user?.role === "Admin" || user?.role === "AutorizadorCompras";

  useEffect(() => {
    fetchQuotes();
  }, [purchaseId]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const data = await QuoteServices.fetchQuotes({ purchaseId });
      setQuotes(data?.items || []);
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = async (quote: QuoteDto, action: "Aceptar" | "Rechazar") => {
    if (action === "Rechazar") {
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
       setSelectedQuoteForOrder(quote);
    }
  };

  const handleFormalizationSuccess = async () => {
    setSelectedQuoteForOrder(null);
    await fetchQuotes();
    onQuoteStatusChanged();
  };

  const lowestPrice = Math.min(...quotes.filter(q => q.totalPrice != null).map(q => q.totalPrice || Infinity));
  const hasApproved = quotes.some(q => q.status === "Aprobada");
  const formatCLP = (val: number) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(val);

  return (
    <div className="space-y-6">
        
      {/* CABECERA */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-4">
         <div>
            <h2 className="text-lg font-bold text-[#1C1C1C]">Comparativa de Precios</h2>
            <p className="text-slate-500 text-sm">Gestiona las ofertas recibidas para esta solicitud.</p>
         </div>
         
         <CreateQuoteDialog 
           purchaseId={purchaseId} 
           initialItems={purchaseItems} 
           onSuccess={() => fetchQuotes()} 
         />
      </div>

      {/* CONTENIDO */}
      {loading ? (
          <div className="py-12 text-center text-slate-500 animate-pulse">Cargando cotizaciones...</div>
      ) : quotes.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-slate-500">
            <AlertCircle className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium">No hay cotizaciones cargadas.</p>
            <p className="text-sm">Usa el botón "Subir Cotización" para agregar la primera.</p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {quotes.map((quote) => {
            const isBestPrice = quote.totalPrice === lowestPrice && quote.totalPrice! > 0;
            const isApproved = quote.status === "Aprobada";
            const isRejected = quote.status === "Rechazada";

            return (
                <div key={quote.id} className={cn("flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden", isApproved ? "border-emerald-500 ring-4 ring-emerald-500/10 shadow-xl scale-[1.02]" : isRejected ? "border-slate-200 opacity-60 grayscale bg-slate-50" : "border-[#F2F2F2] hover:shadow-md")}>
                
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
                    
                    <h3 className="text-xl font-bold text-[#1C1C1C] flex items-center gap-2 mb-1 truncate" title={quote.supplierName || ''}>
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
                                <p className="font-medium text-slate-700 group-hover:text-slate-900 transition-colors">{item.name}</p>
                                <p className="text-xs text-slate-400">{item.quantity} {item.unit} x {formatCLP(item.unitPrice || 0)}</p>
                            </div>
                            <span className="font-semibold text-slate-700 tabular-nums">
                                {formatCLP((item.quantity * (item.unitPrice || 0)))}
                            </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/*  4. Footer Actions: Agregamos la condición `&& canDecide` */}
                {!isApproved && !isRejected && !hasApproved && canDecide && (
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
                        {processingId === quote.id.toString() ? <Loader2 className="h-4 w-4 animate-spin"/> : <CheckCircle2 className="h-4 w-4" />}
                        Aceptar Oferta
                    </button>
                    </div>
                )}
                </div>
            );
            })}
        </div>
      )}

      {selectedQuoteForOrder && (
        <FormalizeOrderDialog 
          open={!!selectedQuoteForOrder}
          onOpenChange={(open) => !open && setSelectedQuoteForOrder(null)}
          purchaseId={purchaseId}
          quote={selectedQuoteForOrder}
          onSuccess={handleFormalizationSuccess}
        />
      )}
    </div>
  );
}