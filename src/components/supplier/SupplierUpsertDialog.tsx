"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { SupplierCreate, SupplierDetail } from "@/interfaces/supplier"
import { cn } from "@/lib/utils"

// Categorías comunes predefinidas para ByG Ingeniería para estandarizar el ingreso
const COMMON_CATEGORIES = [
  "Herramientas Eléctricas",
  "Equipos de Seguridad",
  "Material Eléctrico",
  "Ferretería",
  "Pinturas y Recubrimientos",
  "Tuberías y Válvulas"
]

export type SupplierUpsertValues = SupplierCreate & { mode: "create" | "edit" }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierDetail | null
  onSubmit: (values: SupplierUpsertValues) => Promise<void>
}

export default function SupplierUpsertDialog({ open, onOpenChange, supplier, onSubmit }: Props) {
  const isEdit = !!supplier

  // Estados del formulario
  const [rut, setRut] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  
  // Manejo de categorías como un arreglo en el frontend para mejor UX
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const [loading, setLoading] = useState(false)

  // Reset o Carga de datos al abrir el modal
  useEffect(() => {
    if (open) {
      if (supplier) {
        setRut(supplier.rut)
        setBusinessName(supplier.businessName)
        setContactName(supplier.contactName || "")
        setEmail(supplier.email)
        setPhone(supplier.phone || "")
        setAddress(supplier.address || "")
        setCity(supplier.city || "")
        
        // Convertir el string del backend "EPP, Ferretería" a un array ["EPP", "Ferretería"]
        const cats = supplier.productCategories
          ? supplier.productCategories.split(",").map(c => c.trim()).filter(Boolean)
          : []
        setSelectedCategories(cats)
      } else {
        setRut("")
        setBusinessName("")
        setContactName("")
        setEmail("")
        setPhone("")
        setAddress("")
        setCity("")
        setSelectedCategories([])
      }
    }
  }, [open, supplier])

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    try {
      // Unimos el array a string separado por comas para cumplir con el DTO del Backend
      const productCategoriesStr = selectedCategories.length > 0 ? selectedCategories.join(", ") : undefined

      await onSubmit({
        mode: isEdit ? "edit" : "create",
        rut: rut.trim(),
        businessName: businessName.trim(),
        contactName: contactName.trim() || undefined,
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        productCategories: productCategoriesStr,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="border-b px-6 py-4 bg-slate-50">
          <DialogTitle className="text-xl text-slate-800">
            {isEdit ? "Editar Proveedor" : "Nuevo Proveedor"}
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Completa los datos del proveedor para el Sistema de Compras.
          </p>
        </DialogHeader>

        {/* Body scrolleable */}
        <form id="supplier-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* RUT - Requerido (8 a 12 caracteres según Backend) */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                required
                minLength={8}
                maxLength={12}
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                placeholder="12.345.678-9"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Razón Social - Requerido */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                required
                maxLength={150}
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej: Importadora ByG SpA"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Email - Requerido */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Email de Ventas <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                maxLength={100}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ventas@empresa.cl"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Teléfono</label>
              <input
                maxLength={20}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Nombre Contacto */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Nombre de Contacto Directo</label>
              <input
                maxLength={100}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder="Ej: Juan Pérez (Ejecutivo de Cuentas)"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Dirección */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Dirección</label>
              <input
                maxLength={200}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Av. Industrial 123, Galpón 4"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Ciudad */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Ciudad / Comuna</label>
              <input
                maxLength={100}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Antofagasta"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                disabled={loading}
              />
            </div>

            {/* Categorías (Checkboxes para UX estandarizada) */}
            <div className="space-y-2 md:col-span-2 mt-2">
              <label className="text-xs font-semibold text-slate-600">
                Categorías de Productos que ofrece (Selección Múltiple)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {COMMON_CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => toggleCategory(cat)}
                      disabled={loading}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    />
                    <span className="text-slate-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="border-t px-6 py-4 bg-white sm:justify-end flex-row gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="supplier-form"
            disabled={loading}
            className="rounded-xl bg-red-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Proveedor"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}