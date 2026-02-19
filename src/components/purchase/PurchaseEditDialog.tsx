"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { PurchaseDetail, PurchaseUpdate } from "@/interfaces/purchase"
import { cn } from "@/lib/utils"
import { AlertCircle, FileEdit } from "lucide-react"

export type PurchaseUpsertValues = PurchaseUpdate & { mode: "edit" }

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase: PurchaseDetail | null
  onSubmit: (values: PurchaseUpsertValues) => Promise<{ success: boolean; errorMsg?: string }>
}

export default function PurchaseEditDialog({ open, onOpenChange, purchase, onSubmit }: Props) {
  // Estados de datos
  const [projectName, setProjectName] = useState("")
  const [requester, setRequester] = useState("")
  const [observations, setObservations] = useState("")
  
  // Estados de UI y Errores
  const [loading, setLoading] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  
  const [errors, setErrors] = useState({
      projectName: "",
      requester: ""
  })

  // Carga de datos al abrir
  useEffect(() => {
    if (open && purchase) {
      setGlobalError(null)
      setErrors({ projectName: "", requester: "" })
      
      setProjectName(purchase.projectName)
      setRequester(purchase.requester)
      setObservations(purchase.observations || "")
    }
  }, [open, purchase])

  // Validaciones locales onBlur
  const validateField = (field: 'projectName' | 'requester', value: string) => {
      let errorMsg = "";
      
      if (field === 'projectName') {
          if (!value.trim()) errorMsg = "El nombre del proyecto es obligatorio.";
          else if (value.trim().length < 3) errorMsg = "Debe tener al menos 3 caracteres.";
      }
      
      if (field === 'requester') {
          if (!value.trim()) errorMsg = "El solicitante es obligatorio.";
          else if (value.trim().length < 3) errorMsg = "Debe tener al menos 3 caracteres.";
      }

      setErrors(prev => ({ ...prev, [field]: errorMsg }));
      return !errorMsg;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setGlobalError(null)

    // Validar antes de enviar
    const isProjectOk = validateField('projectName', projectName);
    const isRequesterOk = validateField('requester', requester);

    if (!isProjectOk || !isRequesterOk) return;

    setLoading(true)
    try {
      const result = await onSubmit({
        mode: "edit",
        projectName: projectName.trim(),
        requester: requester.trim(),
        observations: observations.trim() || undefined,
      })

      if (!result.success && result.errorMsg) {
          setGlobalError(result.errorMsg);
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="border-b px-6 py-5 bg-[#F2F2F2]/30">
          <div className="flex items-center gap-2">
            <FileEdit className="h-5 w-5 text-[#E7313C]" />
            <DialogTitle className="text-xl font-bold text-[#1C1C1C]">
              Editar Solicitud {purchase?.purchaseNumber}
            </DialogTitle>
          </div>
          <p className="text-sm text-[#2F2F2F] mt-1">
            Modifica la información básica de la cabecera de compra.
          </p>
        </DialogHeader>

        {globalError && (
            <div className="mx-6 mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-[#E7313C] border border-[#E7313C]/20">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="font-medium">{globalError}</p>
            </div>
        )}

        <form id="purchase-edit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          
          {/* Proyecto */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider">
              Nombre del Proyecto / Obra <span className="text-[#E7313C]">*</span>
            </label>
            <input
              value={projectName}
              onChange={(e) => {
                  setProjectName(e.target.value);
                  if (errors.projectName) setErrors(prev => ({...prev, projectName: ""}));
              }}
              onBlur={(e) => validateField('projectName', e.target.value)}
              placeholder="Ej: Proyecto Minero Antofagasta"
              className={cn(
                  "w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none",
                  errors.projectName 
                    ? "border-[#E7313C] focus:ring-1 focus:ring-[#E7313C]" 
                    : "border-[#F2F2F2] focus:border-[#2F2F2F] focus:ring-1 focus:ring-[#2F2F2F]"
              )}
              disabled={loading}
            />
            {errors.projectName && <p className="text-xs font-medium text-[#E7313C] ml-1">{errors.projectName}</p>}
          </div>

          {/* Solicitante */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider">
              Solicitante <span className="text-[#E7313C]">*</span>
            </label>
            <input
              value={requester}
              onChange={(e) => {
                  setRequester(e.target.value);
                  if (errors.requester) setErrors(prev => ({...prev, requester: ""}));
              }}
              onBlur={(e) => validateField('requester', e.target.value)}
              placeholder="Nombre de la persona en terreno"
              className={cn(
                  "w-full rounded-xl border px-4 py-2.5 text-sm transition-all outline-none",
                  errors.requester 
                    ? "border-[#E7313C] focus:ring-1 focus:ring-[#E7313C]" 
                    : "border-[#F2F2F2] focus:border-[#2F2F2F] focus:ring-1 focus:ring-[#2F2F2F]"
              )}
              disabled={loading}
            />
            {errors.requester && <p className="text-xs font-medium text-[#E7313C] ml-1">{errors.requester}</p>}
          </div>

          {/* Observaciones */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#2F2F2F] uppercase tracking-wider">Observaciones</label>
            <textarea
              rows={4}
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Notas adicionales sobre esta compra..."
              className="w-full rounded-xl border border-[#F2F2F2] px-4 py-2.5 text-sm transition-all outline-none focus:border-[#2F2F2F] focus:ring-1 focus:ring-[#2F2F2F] resize-none"
              disabled={loading}
            />
          </div>

          {/* Info de solo lectura para contexto */}
          <div className="bg-[#F2F2F2]/50 rounded-xl p-4 border border-[#F2F2F2]">
            <p className="text-[10px] font-bold text-[#2F2F2F] uppercase tracking-widest mb-1">Nota del sistema</p>
            <p className="text-xs text-[#2F2F2F] leading-relaxed">
              Los productos y el número de folio no pueden ser editados manualmente para garantizar la trazabilidad con el sistema de inventario.
            </p>
          </div>
        </form>

        <DialogFooter className="border-t px-6 py-4 bg-white sm:justify-end flex-row gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded-xl px-5 py-2.5 text-sm font-bold text-[#2F2F2F] hover:bg-[#F2F2F2] transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="purchase-edit-form"
            disabled={loading}
            className="rounded-xl bg-[#E7313C] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-[#c92a34] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Guardando..." : "Actualizar Compra"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}