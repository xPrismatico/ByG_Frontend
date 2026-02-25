"use client"

import type { PurchaseOrderSummary } from "@/interfaces/purchaseOrder"
import { cn } from "@/lib/utils"
import { Eye, FileText } from "lucide-react"

interface Props {
  orders: PurchaseOrderSummary[]
  onView: (order: PurchaseOrderSummary) => void
}

// Formateador de Moneda CLP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0
  }).format(amount)
}

// Formateador de Fecha
const formatDateTime = (isoDate: string) => {
  try {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  } catch {
    return isoDate
  }
}

// Estilos de Badge según estado de la OC
const getStatusBadgeStyle = (status: string) => {
  const s = status.toLowerCase()
  if (s.includes("emitida")) return "border-blue-200 bg-blue-50 text-blue-700"
  if (s.includes("recepcionada")) return "border-purple-200 bg-purple-50 text-purple-700"
  if (s.includes("facturada")) return "border-amber-200 bg-amber-50 text-amber-700"
  if (s.includes("cerrada") || s.includes("pagada")) return "border-emerald-200 bg-emerald-50 text-emerald-700"
  if (s.includes("anulada")) return "border-red-200 bg-red-50 text-red-700"
  return "border-slate-200 bg-slate-50 text-slate-500"
}

export default function PurchaseOrdersTable({ orders, onView }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 text-left font-semibold">Folio OC</th>
            <th className="p-4 text-left font-semibold">Proyecto</th>
            <th className="p-4 text-left font-semibold">Proveedor</th>
            <th className="p-4 text-left font-semibold">Fecha Emisión</th>
            <th className="p-4 text-right font-semibold">Monto Total</th>
            <th className="p-4 text-center font-semibold">Estado</th>
            <th className="p-4 text-right font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-b last:border-0 hover:bg-slate-50/50 transition-colors"
            >
              {/* Folio y Referencia */}
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-blue-50 p-1.5 text-blue-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 font-mono tracking-tight">
                      {order.orderNumber}
                    </div>
                    {order.purchaseNumber && (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Ref: {order.purchaseNumber}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Proyecto */}
              <td className="p-4">
                <div className="font-medium text-slate-700 max-w-[200px] truncate" title={order.projectName}>
                  {order.projectName}
                </div>
              </td>

              {/* Proveedor */}
              <td className="p-4 text-slate-600">
                <div className="font-medium text-slate-800">{order.supplierName}</div>
              </td>

              {/* Fecha */}
              <td className="p-4 text-slate-500">
                {formatDateTime(order.date)}
              </td>

              {/* Monto (Alineado a la derecha para números) */}
              <td className="p-4 text-right">
                <div className="font-bold text-slate-800">
                  {formatCurrency(order.totalAmount)}
                </div>
              </td>

              {/* Estado */}
              <td className="p-4 text-center">
                <span className={cn(
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                  getStatusBadgeStyle(order.status)
                )}>
                  {order.status}
                </span>
              </td>

              {/* Acciones */}
              <td className="p-4 text-right">
                <button
                  type="button"
                  onClick={() => onView(order)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Ver Detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}