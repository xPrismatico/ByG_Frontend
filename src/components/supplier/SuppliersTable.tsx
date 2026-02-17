"use client"

import type { SupplierSummary } from "@/interfaces/supplier"
import { cn } from "@/lib/utils"
import { Eye, Pencil, Power, Trash2 } from "lucide-react"

interface Props {
  suppliers: SupplierSummary[]
  onView: (s: SupplierSummary) => void
  onEdit: (s: SupplierSummary) => void
  onToggleActive: (s: SupplierSummary) => void
  onDelete: (s: SupplierSummary) => void | Promise<void>
}

export default function SuppliersTable({
  suppliers,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="border-b bg-slate-50 text-slate-600">
          <tr>
            <th className="p-4 text-left font-semibold">Razón Social y RUT</th>
            <th className="p-4 text-left font-semibold">Contacto</th>
            <th className="p-4 text-left font-semibold">Categorías</th>
            <th className="p-4 text-center font-semibold">Estado</th>
            <th className="p-4 text-right font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((s) => {
            // Separar categorías por coma para mostrarlas como badges
            const categories = s.productCategories
              ? s.productCategories.split(",").map((c) => c.trim()).filter(Boolean)
              : []

            return (
              <tr
                key={s.id}
                className={cn(
                  "border-b last:border-0 hover:bg-slate-50/50 transition-colors",
                  !s.isActive && "opacity-60 bg-slate-50"
                )}
              >
                {/* Razón Social y RUT combinados para ahorrar espacio horizontal */}
                <td className="p-4">
                  <div className="font-semibold text-slate-900">{s.businessName}</div>
                  <div className="mt-0.5 text-xs text-slate-500 font-mono">{s.rut}</div>
                </td>

                <td className="p-4 text-slate-600">{s.email}</td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-1.5">
                    {categories.length > 0 ? (
                      categories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        >
                          {cat}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">Sin categorías</span>
                    )}
                  </div>
                </td>

                <td className="p-4 text-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                      s.isActive
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-100 text-slate-500"
                    )}
                  >
                    {s.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <div className="inline-flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => onView(s)}
                      className="rounded-md border p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                      title="Ver Detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="rounded-md border p-2 text-slate-600 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleActive(s)}
                      className={cn(
                        "rounded-md border p-2 transition-colors",
                        s.isActive
                          ? "text-red-600 hover:bg-red-50 border-transparent hover:border-red-200"
                          : "text-emerald-600 hover:bg-emerald-50 border-transparent hover:border-emerald-200"
                      )}
                      title={s.isActive ? "Desactivar" : "Activar"}
                    >
                      <Power className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar permanentemente a ${s.businessName}?`)) {
                          onDelete(s)
                        }
                      }}
                      className="rounded-md border border-transparent p-2 text-slate-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                      title="Eliminar Permanente"
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