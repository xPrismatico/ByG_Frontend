"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PurchaseSummary, PurchaseDetail, PurchaseUpdate } from "@/interfaces/purchase"
import { AlertCircle } from "lucide-react"
import { PurchaseServices } from "@/services/PurchaseServices"
import PurchasesTable from "@/components/purchase/PurchasesTable"
import PurchaseEditDialog, { PurchaseUpsertValues } from "@/components/purchase/PurchaseEditDialog"
import PurchaseFilters from "@/components/purchase/PurchaseFilters"
import { cn } from "@/lib/utils"

export default function PurchasesPage() {
  const router = useRouter()

  const [purchases, setPurchases] = useState<PurchaseSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(15) 

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState("date_desc")

  const [editOpen, setEditOpen] = useState(false)
  const [selectedPurchase, setSelectedPurchase] = useState<PurchaseDetail | null>(null)
  
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  // ✅ NUEVO: Estado para saber qué fila se está editando y mostrar un loader
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    let alive = true
    const delayDebounceFn = setTimeout(() => {
      async function loadData() {
        setLoading(true)
        setErrorMsg(null)
        
        const res = await PurchaseServices.getPurchases({ 
          search, 
          status, 
          startDate, 
          endDate, 
          sortBy, 
          pageNumber: page, 
          pageSize 
        })
        
        if (!alive) return

        if (res.success && res.data) {
          setPurchases(res.data.items || [])
          setTotalPages(res.data.totalPages || 1)
          setTotalItems(res.data.totalItems || 0)
        } else {
          setErrorMsg(res.message || "Error al cargar las solicitudes de compra.")
          setPurchases([])
        }
        setLoading(false)
      }
      loadData()
    }, 400) 

    return () => {
      alive = false
      clearTimeout(delayDebounceFn)
    }
  }, [search, status, startDate, endDate, sortBy, page, pageSize])

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
    setTotalItems((prev) => prev - 1)
    setDeletingIds((prev) => {
      const next = new Set(prev); next.delete(purchase.id); return next
    })
  }

  function handleView(purchase: PurchaseSummary) {
    router.push(`/compra/${purchase.id}`)
  }

  async function handleEdit(purchase: PurchaseSummary) {
    // Si ya estamos cargando una edición, bloqueamos el botón
    if (editingId) return; 

    setEditingId(purchase.id);
    setErrorMsg(null);
    
    const res = await PurchaseServices.getPurchaseById(purchase.id);
    
    setEditingId(null); // Termina la carga
    
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar la información para editar.");
      return;
    }
    
    setSelectedPurchase(res.data);
    setEditOpen(true);
  }

  async function handleEditSubmit(payload: PurchaseUpsertValues): Promise<{ success: boolean; errorMsg?: string }> {
    if (!selectedPurchase) return { success: false, errorMsg: "No hay compra seleccionada." }

    const updateData: PurchaseUpdate = {
      projectName: payload.projectName,
      requester: payload.requester,
      observations: payload.observations
    }

    const res = await PurchaseServices.updatePurchase(selectedPurchase.id, updateData)

    if (res.success && res.data) {
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
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C]">Gestión de Compras</h1>
        <p className="text-sm text-[#2F2F2F] mt-1">
          Administra solicitudes de compra, cotizaciones y seguimiento de estados
        </p>
      </div>

      <PurchaseFilters 
        search={search}
        status={status}
        startDate={startDate}
        endDate={endDate}
        sortBy={sortBy}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        onStartDateChange={(v) => { setStartDate(v); setPage(1); }}
        onEndDateChange={(v) => { setEndDate(v); setPage(1); }}
        onSortChange={(v) => { setSortBy(v); setPage(1); }}
        onClear={() => { 
          setSearch(""); 
          setStatus(""); 
          setStartDate(""); 
          setEndDate(""); 
          setSortBy("date_desc"); 
          setPage(1); 
        }}
      />

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-[#E7313C] bg-red-50 p-4 text-sm text-[#E7313C]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#F2F2F2]">
          {!loading && (
            <p className="text-sm text-[#2F2F2F] mt-0.5">
              {totalItems} {totalItems === 1 ? 'solicitud encontrada' : 'solicitudes encontradas'}
            </p>
          )}
        </div>

        <div className="p-0 relative">
          {loading && purchases.length > 0 && (
             <div className="absolute inset-0 bg-white/50 z-10" />
          )}

          {loading && purchases.length === 0 ? (
            <div className="flex h-48 items-center justify-center text-[#2F2F2F]">
              Cargando solicitudes...
            </div>
          ) : purchases?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-[#2F2F2F]">
              <p>No hay compras registradas que coincidan con los filtros.</p>
            </div>
          ) : (
            <PurchasesTable
              purchases={purchases}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              editingId={editingId} // Pasamos el prop a la tabla
            />
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#F2F2F2] flex items-center justify-between bg-white">
            <p className="text-sm text-[#2F2F2F]">
              Página <span className="font-semibold text-[#1C1C1C]">{page}</span> de <span className="font-semibold text-[#1C1C1C]">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#F2F2F2] text-[#2F2F2F] hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#F2F2F2] text-[#2F2F2F] hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

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