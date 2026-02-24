"use client"

import type { PurchaseOrderSummary } from "@/interfaces/purchaseOrder"
import { cn } from "@/lib/utils"
import { Eye, FileText, Download } from "lucide-react"

interface Props {
  orders: PurchaseOrderSummary[]
  onView: (id: number) => void
}

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0
  }).format(amount)
}

const formatDate = (isoDate: string) => {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(isoDate))
  } catch { return isoDate }
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "Emitida": return "border-blue-200 bg-blue-50 text-blue-700"
    case "Recepcionada": return "border-amber-200 bg-amber-50 text-amber-700" // Amarillo porque falta facturar
    case "Facturada": return "border-purple-200 bg-purple-50 text-purple-700"
    case "Cerrada": return "border-emerald-200 bg-emerald-50 text-emerald-700" // Verde = Proceso OK
    case "Anulada": return "border-red-200 bg-red-50 text-red-700"
    default: return "border-slate-200 bg-slate-50 text-slate-500"
  }
}

export default function PurchaseOrdersTable({ orders, onView }: Props) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm">
        <thead className="border-b border-[#F2F2F2] bg-[#F2F2F2]/50 text-[#2F2F2F]">
          <tr>
            <th className="p-4 text-left font-semibold">N° Orden / Proyecto</th>
            <th className="p-4 text-left font-semibold">Proveedor</th>
            <th className="p-4 text-left font-semibold">Fecha Emisión</th>
            <th className="p-4 text-right font-semibold">Monto Total</th>
            <th className="p-4 text-left font-semibold">Estado</th>
            <th className="p-4 text-right font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((oc) => (
            <tr key={oc.id} className="border-b border-[#F2F2F2] last:border-0 hover:bg-[#F2F2F2]/40 transition-colors">
              
              {/* Columna Identificador */}
              <td className="p-4">
                <div className="font-bold text-[#1C1C1C] font-mono tracking-tight">{oc.orderNumber}</div>
                <div className="text-xs text-[#2F2F2F] mt-0.5 line-clamp-1 max-w-[180px]" title={oc.projectName}>
                  {oc.projectName}
                </div>
              </td>

              {/* Columna Proveedor (Muy importante) */}
              <td className="p-4 font-medium text-[#2F2F2F]">
                {oc.supplierName}
              </td>

              <td className="p-4 text-[#2F2F2F]">
                {formatDate(oc.issueDate)}
              </td>

              {/* Columna Monto alineada a derecha (estándar financiero) */}
              <td className="p-4 text-right font-bold text-[#1C1C1C]">
                {formatCurrency(oc.totalAmount, oc.currency)}
              </td>

              <td className="p-4">
                <span className={cn("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", getStatusStyle(oc.status))}>
                  {oc.status}
                </span>
              </td>

              <td className="p-4 text-right">
                <div className="inline-flex gap-2 justify-end">
                  <button 
                    onClick={() => console.log("Descargar PDF", oc.id)}
                    className="p-2 text-slate-400 hover:text-[#E7313C] transition-colors"
                    title="Descargar PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onView(oc.id)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#F2F2F2] p-2 text-[#2F2F2F] hover:bg-[#F2F2F2] hover:text-[#1C1C1C] transition-colors bg-white font-medium text-xs shadow-sm"
                  >
                    <Eye className="h-4 w-4" /> Ver
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}