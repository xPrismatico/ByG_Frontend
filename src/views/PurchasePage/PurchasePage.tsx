"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PurchaseSummary, PurchaseDetail, PurchaseUpdate } from "@/interfaces/purchase"
import { AlertCircle } from "lucide-react"
import { PurchaseServices } from "@/services/PurchaseServices"
import PurchasesTable from "@/components/purchase/PurchasesTable"
import PurchaseEditDialog, { PurchaseUpsertValues } from "@/components/purchase/PurchaseEditDialog"

export default function PurchasesPage() {
  const router = useRouter()

  const [purchases, setPurchases] = useState<PurchaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Estados para Modales de Edición
  const [editOpen, setEditOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseDetail | null>(null)

  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    let alive = true
    async function loadData() {
      setLoading(true)
      const res = await PurchaseServices.getPurchases()
      if (!alive) return
      if (res.success && res.data) {
        setPurchases(res.data)
      } else {
        setErrorMsg(res.message || "Error al cargar las solicitudes de compra.")
      }
      setLoading(false)
    }
    loadData()
    return () => { alive = false }
  }, [])

  async function handleDelete(purchase: PurchaseSummary) {
    if (deletingIds.has(purchase.id)) return
    setDeletingIds((prev) => new Set(prev).add(purchase.id))
    setErrorMsg(null)
    const res = await PurchaseServices.deletePurchase(purchase.id)
    if (!res.success) {
      setErrorMsg(res.errors?.[0] || "No se pudo eliminar la solicitud de compra.")
      setDeletingIds((prev) => {
        const next = new Set(prev); next.delete(purchase.id); return next
      })
      return
    }
    setPurchases((prev) => prev.filter((p) => p.id !== purchase.id))
    setDeletingIds((prev) => {
      const next = new Set(prev); next.delete(purchase.id); return next
    })
  }

  function handleView(purchase: PurchaseSummary) {
    router.push(`/compra/${purchase.id}`)
  }

  async function handleEdit(purchase: PurchaseSummary) {
    setErrorMsg(null)
    const res = await PurchaseServices.getPurchaseById(purchase.id)
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar la información para editar.")
      return
    }
    setSelectedPurchase(res.data)
    setEditOpen(true)
  }

  // ✅ FUNCIONAL: Lógica para procesar la edición desde el Dialog
  async function handleEditSubmit(payload: PurchaseUpsertValues): Promise<{ success: boolean; errorMsg?: string }> {
    if (!selectedPurchase) return { success: false, errorMsg: "No hay compra seleccionada." }

    const updateData: PurchaseUpdate = {
      projectName: payload.projectName,
      requester: payload.requester,
      observations: payload.observations
    }

    const res = await PurchaseServices.updatePurchase(selectedPurchase.id, updateData)

    if (res.success && res.data) {
      // Actualizar la fila en la tabla local para reflejar los cambios sin recargar
      setPurchases((prev) =>
        prev.map((p) => (p.id === selectedPurchase.id ? {
          ...p,
          projectName: res.data!.projectName,
          requester: res.data!.requester
        } : p))
      )
      setEditOpen(false)
      setSelectedPurchase(null)
      return { success: true }
    }

    return { 
      success: false, 
      errorMsg: res.errors?.[0] || "Ocurrió un error al actualizar la compra." 
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full">
      {/* Cabecera... */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Gestión de Compras</h1>
        <p className="text-sm text-[#2F2F2F] mt-1">
          Administra solicitudes de compra, cotizaciones y seguimiento de estados
        </p>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-[#E7313C] bg-red-50 p-4 text-sm text-[#E7313C]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#F2F2F2]">
          {!loading && (
            <p className="text-sm text-[#2F2F2F] mt-0.5">{purchases.length} solicitudes encontradas</p>
          )}
        </div>

        <div className="p-0">
          {loading ? (
            <div className="flex h-48 items-center justify-center text-[#2F2F2F]">
              Cargando solicitudes...
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#2F2F2F]">
              <p>No hay compras registradas en el sistema.</p>
            </div>
          ) : (
            <PurchasesTable
              purchases={purchases}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* ✅ FUNCIONAL: Instancia del Modal de Edición */}
      <PurchaseEditDialog 
        open={editOpen} 
        onOpenChange={(open: boolean) => { 
          setEditOpen(open)
          if(!open) setSelectedPurchase(null)
        }} 
        purchase={selectedPurchase} 
        onSubmit={handleEditSubmit}
      /> 

    </div>
  )
}