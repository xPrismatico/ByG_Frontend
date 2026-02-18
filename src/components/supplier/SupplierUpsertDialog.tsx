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
import { AlertCircle } from "lucide-react"

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
  onSubmit: (values: SupplierUpsertValues) => Promise<{ success: boolean; errorMsg?: string }>
}

// --- UTILIDADES ---

const formatRut = (val: string) => {
  let clean = val.replace(/[^0-9kK]/g, "").toUpperCase()
  if (!clean) return ""
  if (clean.length <= 1) return clean
  const body = clean.slice(0, -1)
  const dv = clean.slice(-1)
  const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  return `${formattedBody}-${dv}`
}

const formatPhone = (val: string) => {
  let clean = val.replace(/[^\d\+ ]/g, "")
  if (clean.indexOf('+') > 0) {
    clean = clean.replace(/\+/g, "")
    clean = '+' + clean
  }
  return clean
}

// Validación de RUT (mínima estructura)
const isRutValid = (rut: string) => {
    return /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9Kk]{1}$/.test(rut);
}

export default function SupplierUpsertDialog({ open, onOpenChange, supplier, onSubmit }: Props) {
  const isEdit = !!supplier

  // Estados de datos
  const [rut, setRut] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [contactName, setContactName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  
  // Estados de UI y Errores
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  
  // Errores individuales por campo
  const [errors, setErrors] = useState({
      rut: "",
      businessName: "",
      email: "",
      phone: "",
      contactName: "",
      address: "",
      city: ""
  })

  // Limpieza inicial
  useEffect(() => {
    if (open) {
      setGlobalError(null)
      setErrors({ rut: "", businessName: "", email: "", phone: "", contactName: "", address: "", city: "" })
      if (supplier) {
        setRut(formatRut(supplier.rut))
        setBusinessName(supplier.businessName)
        setContactName(supplier.contactName || "")
        setEmail(supplier.email)
        setPhone(supplier.phone || "")
        setAddress(supplier.address || "")
        setCity(supplier.city || "")
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

  // --- VALIDACIONES ON BLUR ---
  const validateField = (field: string, value: string) => {
      let errorMsg = "";
      
      switch (field) {
          case 'rut':
              if (!value) errorMsg = "El RUT es obligatorio.";
              else if (value.length < 11 || !isRutValid(value)) errorMsg = "Formato de RUT inválido (Ej: 12.345.678-9).";
              break;
          case 'businessName':
              if (!value) errorMsg = "La Razón Social es obligatoria.";
              else if (value.trim().length < 2) errorMsg = "Debe tener al menos 2 caracteres.";
              break;
          case 'email':
              if (!value) errorMsg = "El email es obligatorio.";
              else if (!/^\S+@\S+\.\S+$/.test(value)) errorMsg = "Ingresa un email válido.";
              break;
          case 'phone':
              if (value && value.trim().length < 8) errorMsg = "El teléfono debe tener al menos 8 dígitos.";
              break;
          case 'contactName':
              if (value && value.trim().length < 3) errorMsg = "El nombre debe tener al menos 3 caracteres.";
              break;
          case 'address':
               if (value && value.trim().length < 5) errorMsg = "La dirección debe tener al menos 5 caracteres.";
               break;
          case 'city':
               if (value && value.trim().length < 3) errorMsg = "La ciudad debe tener al menos 3 caracteres.";
               break;
      }

      setErrors(prev => ({ ...prev, [field]: errorMsg }));
      return !errorMsg;
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setGlobalError(null)

    // Validar todos los campos antes de enviar
    const isRutOk = validateField('rut', rut);
    const isBusinessOk = validateField('businessName', businessName);
    const isEmailOk = validateField('email', email);
    const isPhoneOk = validateField('phone', phone);
    const isContactOk = validateField('contactName', contactName);
    const isAddressOk = validateField('address', address);
    const isCityOk = validateField('city', city);

    if (!isRutOk || !isBusinessOk || !isEmailOk || !isPhoneOk || !isContactOk || !isAddressOk || !isCityOk) {
        return; // Detener si hay errores locales
    }

    setLoading(true)
    try {
      const productCategoriesStr = selectedCategories.length > 0 ? selectedCategories.join(", ") : undefined

      // Esperamos el resultado del submit (modificaremos SuppliersPage para que devuelva esto)
      const result = await onSubmit({
        mode: isEdit ? "edit" : "create",
        rut: rut.trim(),
        businessName: businessName.trim(),
        contactName: contactName.trim() || undefined,
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        productCategories: productCategoriesStr,
      })

      if (!result.success && result.errorMsg) {
          setGlobalError(result.errorMsg); // Mostrar error devuelto por el backend
      }

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

        {/* --- BANNER DE ERROR GLOBAL (EJ: RUT DUPLICADO) --- */}
        {globalError && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <p>{globalError}</p>
            </div>
        )}

        <form id="supplier-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* RUT */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                RUT <span className="text-red-500">*</span>
              </label>
              <input
                value={rut}
                onChange={(e) => {
                    setRut(formatRut(e.target.value));
                    if (errors.rut) setErrors(prev => ({...prev, rut: ""})); // Limpiar error al escribir
                }}
                onBlur={(e) => validateField('rut', e.target.value)}
                placeholder="12.345.678-9"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors uppercase",
                    errors.rut ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
              {errors.rut && <p className="text-xs text-red-500 mt-1">{errors.rut}</p>}
            </div>

            {/* Razón Social */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Razón Social <span className="text-red-500">*</span>
              </label>
              <input
                maxLength={150}
                value={businessName}
                onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName) setErrors(prev => ({...prev, businessName: ""}));
                }}
                onBlur={(e) => validateField('businessName', e.target.value)}
                placeholder="Ej: Importadora ByG SpA"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.businessName ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">
                Email de Ventas <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                maxLength={100}
                value={email}
                onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({...prev, email: ""}));
                }}
                onBlur={(e) => validateField('email', e.target.value)}
                placeholder="ventas@empresa.cl"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.email ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Teléfono</label>
              <input
                type="tel"
                maxLength={20}
                value={phone}
                onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    if (errors.phone) setErrors(prev => ({...prev, phone: ""}));
                }}
                onBlur={(e) => validateField('phone', e.target.value)}
                placeholder="+56 9 1234 5678"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.phone ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            {/* Nombre Contacto */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Nombre de Contacto Directo</label>
              <input
                maxLength={100}
                value={contactName}
                onChange={(e) => {
                    setContactName(e.target.value);
                    if (errors.contactName) setErrors(prev => ({...prev, contactName: ""}));
                }}
                onBlur={(e) => validateField('contactName', e.target.value)}
                placeholder="Ej: Juan Pérez (Ejecutivo de Cuentas)"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.contactName ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.contactName && <p className="text-xs text-red-500 mt-1">{errors.contactName}</p>}
            </div>

            {/* Dirección */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Dirección</label>
              <input
                maxLength={200}
                value={address}
                onChange={(e) => {
                    setAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({...prev, address: ""}));
                }}
                onBlur={(e) => validateField('address', e.target.value)}
                placeholder="Av. Industrial 123, Galpón 4"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.address ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            {/* Ciudad */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Ciudad / Comuna</label>
              <input
                maxLength={100}
                value={city}
                onChange={(e) => {
                    setCity(e.target.value);
                    if (errors.city) setErrors(prev => ({...prev, city: ""}));
                }}
                onBlur={(e) => validateField('city', e.target.value)}
                placeholder="Ej: Antofagasta"
                className={cn(
                    "w-full rounded-md border px-3 py-2 text-sm focus:outline-none transition-colors",
                    errors.city ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                )}
                disabled={loading}
              />
               {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Categorías */}
            <div className="space-y-2 md:col-span-2 mt-2">
              <label className="text-xs font-semibold text-slate-600">
                Categorías de Productos que ofrece
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
            className="rounded-xl bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Guardando..." : isEdit ? "Guardar Cambios" : "Crear Proveedor"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}