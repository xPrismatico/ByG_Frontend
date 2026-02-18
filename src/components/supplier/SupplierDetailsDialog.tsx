"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { SupplierDetail } from "@/interfaces/supplier"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  User, 
  Calendar, 
  Hash,
  Tags
} from "lucide-react"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierDetail | null
}

// Formateador de fecha nativo para Chile
function formatDateChile(dateString: string) {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date(dateString))
  } catch {
    return dateString
  }
}

export default function SupplierDetailsDialog({ open, onOpenChange, supplier }: Props) {
  if (!supplier) return null

  // Procesar categorías
  const categories = supplier.productCategories
    ? supplier.productCategories.split(",").map(c => c.trim()).filter(Boolean)
    : []

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[650px] p-0 overflow-hidden flex flex-col max-h-[90vh] bg-slate-50/50">
        
        {/* Header con Título y Estado */}
        <DialogHeader className="border-b px-6 py-5 bg-white flex flex-row items-start justify-between gap-4 sticky top-0 z-10">
          <div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              {supplier.businessName}
            </DialogTitle>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500 font-mono">
              <Hash className="h-4 w-4" />
              RUT: {supplier.rut}
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider mt-1",
              supplier.isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-500"
            )}
          >
            {supplier.isActive ? "Activo" : "Inactivo"}
          </span>
        </DialogHeader>

        {/* Body con la información */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          
          {/* Grid de Contacto y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Tarjeta de Contacto */}
            <div className="rounded-xl border bg-white p-4 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Información de Contacto
              </h3>
              
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Nombre Contacto</p>
                  <p className="text-sm font-medium text-slate-900">
                    {supplier.contactName || "No especificado"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email de Ventas</p>
                  <a href={`mailto:${supplier.email}`} className="text-sm font-medium text-blue-600 hover:underline break-all">
                    {supplier.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Teléfono</p>
                  {supplier.phone ? (
                    <a href={`tel:${supplier.phone}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {supplier.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500">No especificado</p>
                  )}
                </div>
              </div>
            </div>

            {/* Tarjeta de Ubicación y Metadata */}
            <div className="rounded-xl border bg-white p-4 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ubicación y Registro
              </h3>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Dirección Comercial</p>
                  <p className="text-sm font-medium text-slate-900">
                    {supplier.address || "No especificada"}
                  </p>
                  {supplier.city && (
                    <p className="text-sm text-slate-600 mt-0.5">{supplier.city}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-medium">Fecha de Registro</p>
                  <p className="text-sm font-medium text-slate-900">
                    {formatDateChile(supplier.registeredAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Categorías */}
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tags className="h-5 w-5 text-slate-400" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Categorías de Productos Suministrados
              </h3>
            </div>
            
            {categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic px-1">
                Este proveedor no tiene categorías asignadas.
              </p>
            )}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  )
}