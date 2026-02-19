import { useEffect, useState } from "react";
import { QuoteServices } from "@/services/QuoteServices";
import { QuoteDto } from "@/interfaces/Quote";
import { PurchaseItem } from "@/interfaces/purchase";
import { CheckCircle2, XCircle, Building2, AlertCircle, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  purchaseId: number;
  purchaseItems: PurchaseItem[]; // Para cruzar datos si fuera necesario
  onQuoteStatusChanged: () => void; // Callback para recargar la compra general
}

export default function QuotesComparisonTab({ purchaseId, onQuoteStatusChanged }: Props) {
  const [quotes, setQuotes] = useState<QuoteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchQuotes();
  }, [purchaseId]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      // Usamos el nuevo filtro del backend
      const data = await QuoteServices.fetchQuotes({ purchaseId });
      setQuotes(data || []);
    } catch (error) {
      console.error("Error fetching quotes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (quoteId: string | number, newStatus: "Aprobada" | "Rechazada") => {
    setActionLoading(quoteId.toString());
    try {
      await QuoteServices.toggleStatus(Number(quoteId), newStatus);
      await fetchQuotes(); // Recargar la lista
      onQuoteStatusChanged(); // Avisar al componente padre que algo cambió
    } catch (error) {
      console.error("Error al actualizar estado", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="py-12 text-center text-slate-500 animate-pulse">Cargando cotizaciones...</div>;

  if (quotes.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-slate-500">
        <AlertCircle className="h-12 w-12 mb-4 text-slate-300" />
        <p className="text-lg font-medium">No se han subido cotizaciones formales aún.</p>
        <p className="text-sm">El Gestor de Compras debe cargarlas al sistema.</p>
      </div>
    );
  }

  // Identificar el precio más bajo para destacarlo (UX)
  const lowestPrice = Math.min(...quotes.filter(q => q.totalPrice != null).map(q => q.totalPrice || Infinity));
  const hasApproved = quotes.some(q => q.status === "Aprobada");

  // Formateador de moneda CLP
  const formatCLP = (value: number) => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {quotes.map((quote) => {
        const isBestPrice = quote.totalPrice === lowestPrice && quote.totalPrice > 0;
        const isApproved = quote.status === "Aprobada";
        const isRejected = quote.status === "Rechazada";

        return (
          <div 
            key={quote.id} 
            className={cn(
              "flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden",
              isApproved ? "border-green-500 ring-2 ring-green-500/20" : 
              isRejected ? "border-slate-200 opacity-70 grayscale-[0.5]" : 
              "border-[#F2F2F2] hover:shadow-lg"
            )}
          >
            {/* Header de la Tarjeta */}
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{quote.number}</span>
                {isBestPrice && !isRejected && !hasApproved && (
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">
                    <TrendingDown className="h-3 w-3" /> MEJOR PRECIO
                  </span>
                )}
                {isApproved && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">APROBADA</span>}
                {isRejected && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full">RECHAZADA</span>}
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1C] flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-400" />
                {quote.supplierName}
              </h3>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Cotizado</p>
                  <p className="text-2xl font-black text-[#1C1C1C]">
                    {quote.totalPrice ? formatCLP(quote.totalPrice) : 'Sin precio'}
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de Productos */}
            <div className="p-5 flex-1 bg-white">
              <h4 className="text-sm font-bold text-slate-900 mb-3 border-b pb-2">Desglose de productos</h4>
              <ul className="space-y-3">
                {quote.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between items-start text-sm">
                    <div className="pr-4">
                      <p className="font-medium text-slate-700">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.quantity} {item.unit} x {formatCLP(item.unitPrice || 0)}</p>
                    </div>
                    <span className="font-bold text-slate-700">
                      {formatCLP((item.quantity * (item.unitPrice || 0)))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Botones de Acción (Solo visibles si está Pendiente y no hay otra aprobada) */}
            {quote.status !== "Aprobada" && quote.status !== "Rechazada" && (
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => handleStatusChange(quote.id, "Aprobada")}
                  disabled={hasApproved || actionLoading !== null}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" /> 
                  {actionLoading === quote.id.toString() ? "Procesando..." : "Aceptar"}
                </button>
                <button
                  onClick={() => handleStatusChange(quote.id, "Rechazada")}
                  disabled={hasApproved || actionLoading !== null}
                  className="flex-1 flex items-center justify-center gap-2 bg-white border-2 border-slate-200 hover:border-red-500 hover:text-red-600 text-slate-600 py-2.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Rechazar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}