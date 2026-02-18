"use client"

import type { PurchaseSummary } from "@/interfaces/purchase"
import { cn } from "@/lib/utils"
import { Eye, Pencil, Trash2, Package } from "lucide-react"

interface Props {
  purchases: PurchaseSummary[]
  onEdit: (p: PurchaseSummary) => void
  onDelete: (p: PurchaseSummary) => void | Promise<void>
  onView: (p: PurchaseSummary) => void
}

const formatDateTime = (isoDate: string) => {
  try {
    const date = new Date(isoDate)
    return new Intl.DateTimeFormat('es-CL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return isoDate
  }
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case "Solicitud recibida":
      return "border-slate-200 bg-slate-100 text-slate-600"
    case "Solicitud de cotización enviada":
      return "border-blue-200 bg-blue-50 text-blue-700"
    case "Esperando revisión":
      return "border-amber-200 bg-amber-50 text-amber-700"
    case "Orden de compra emitida":
      return "border-emerald-200 bg-emerald-50 text-emerald-700"
    case "Rechazada":
      return "border-red-200 bg-red-50 text-red-700"
    default:
      return "border-slate-200 bg-slate-50 text-slate-500"
  }
}

export default function PurchasesTable({
  purchases,
  onView,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 text-left font-semibold">N° Compra / Proyecto</th>
            <th className="p-4 text-left font-semibold">Fecha Solicitud</th>
            <th className="p-4 text-left font-semibold">Solicitante</th>
            <th className="p-4 text-center font-semibold">Items</th>
            <th className="p-4 text-left font-semibold">Estado</th>
            <th className="p-4 text-right font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {purchases.map((p) => {
            const isRejected = p.status === "Rechazada"

            return (
              <tr
                key={p.id}
                className={cn(
                  "border-b last:border-0 hover:bg-slate-50/50 transition-colors",
                  isRejected && "opacity-60 bg-slate-50"
                )}
              >
                <td className="p-4">
                  <div className="font-semibold text-slate-900 font-mono tracking-tight">
                    {p.purchaseNumber}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-[200px]" title={p.projectName}>
                    {p.projectName}
                  </div>
                </td>

                <td className="p-4 text-slate-600">
                  {formatDateTime(p.requestDate)}
                </td>

                <td className="p-4 text-slate-700 font-medium">
                  {p.requester}
                </td>

                <td className="p-4 text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                    <Package className="h-3.5 w-3.5" />
                    {p.itemsCount} {p.itemsCount === 1 ? 'item' : 'items'}
                  </div>
                </td>

                <td className="p-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
                      getStatusBadgeStyle(p.status)
                    )}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="inline-flex gap-2 justify-end">
                    {/* Botón Ver: Ahora funcional con onView */}
                    <button
                      type="button"
                      onClick={() => onView(p)}
                      className="inline-flex items-center gap-1.5 rounded-md border p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors bg-white font-medium text-xs shadow-sm"
                      title="Ver detalles de la Compra"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </button>

                    {/* Botón Editar */}
                    <button
                      type="button"
                      onClick={() => onEdit(p)}
                      className="inline-flex items-center gap-1.5 rounded-md border p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors bg-white font-medium text-xs shadow-sm"
                      title="Editar Datos de la Compra"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="hidden sm:inline">Editar</span>
                    </button>

                    {/* Botón Eliminar */}
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar la solicitud ${p.purchaseNumber}? Esta acción no se puede deshacer.`)) {
                          onDelete(p)
                        }
                      }}
                      className="rounded-md border border-transparent p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Eliminar Compra"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}