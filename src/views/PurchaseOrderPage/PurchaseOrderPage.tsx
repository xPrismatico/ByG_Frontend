// src/views/PurchaseOrderPage/PurchaseOrderPage.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, FileCheck } from "lucide-react"

// Importaciones de servicios e interfaces
import { PurchaseOrderServices } from "@/services/PurchaseOrderServices"
import type { PurchaseOrderSummary } from "@/interfaces/purchaseOrder"

// Importación de Componentes
import PurchaseOrderFilters from "@/components/purchaseOrder/PurchaseOrderFilters"
import PurchaseOrdersTable from "@/components/purchaseOrder/PurchaseOrdersTable"

export default function PurchaseOrderPage() {
  const router = useRouter()

  // Estados de datos y carga
  const [orders, setOrders] = useState<PurchaseOrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Estados de Paginación
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(15)

  // Estados de Filtros
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState("date_desc")

  // Efecto de Carga con Debounce
  useEffect(() => {
    let alive = true
    const delayDebounceFn = setTimeout(() => {
      async function loadData() {
        setLoading(true)
        setErrorMsg(null)
        
        const res = await PurchaseOrderServices.getAll({ 
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
          setOrders(res.data.items || [])
          setTotalPages(res.data.totalPages || 1)
          setTotalItems(res.data.totalItems || 0)
        } else {
          setErrorMsg(res.message || "Error al cargar las órdenes de compra.")
          setOrders([])
        }
        setLoading(false)
      }
      loadData()
    }, 400) // 400ms de debounce

    return () => {
      alive = false
      clearTimeout(delayDebounceFn)
    }
  }, [search, status, startDate, endDate, sortBy, page, pageSize])

  // Navegación al detalle
  function handleView(order: PurchaseOrderSummary) {
    // Redirigir a la vista de detalle de la OC
    // Asumimos que crearás esta ruta más adelante: src/app/orden-compra/[id]/page.tsx
    router.push(`/orden-compra/${order.id}`)
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full min-h-screen bg-slate-50/50">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-slate-200/60">
        <div className="p-2 bg-red-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
            <FileCheck className="h-6 w-6" />
        </div>
        <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Órdenes de Compra</h1>
            <p className="text-sm text-slate-500 font-medium">
            Historial y gestión de documentos emitidos a proveedores
            </p>
        </div>
      </div>

      {/* Componente de Filtros */}
      <PurchaseOrderFilters 
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

      {/* Mensajes de Error */}
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      {/* Contenedor de la Tabla */}
      <div className="flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header de Tabla (Contador) */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          {!loading && (
            <p className="text-sm font-medium text-slate-600">
              Se encontraron <span className="text-slate-900 font-bold">{totalItems}</span> órdenes
            </p>
          )}
        </div>

        {/* Tabla + Loading States */}
        <div className="relative min-h-[300px]">
          {loading && orders.length > 0 && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center">
                 <div className="flex items-center gap-2 text-blue-600 font-medium bg-white px-4 py-2 rounded-full shadow-sm border">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Actualizando...
                 </div>
             </div>
          )}

          {loading && orders.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-slate-400">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500" />
                    <p className="text-sm">Cargando órdenes...</p>
                </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <div className="p-4 bg-slate-50 rounded-full mb-3">
                  <FileCheck className="h-8 w-8 text-slate-300" />
              </div>
              <p className="font-medium">No se encontraron órdenes de compra.</p>
              <p className="text-xs text-slate-400 mt-1">Intenta ajustar los filtros de búsqueda.</p>
            </div>
          ) : (
            <PurchaseOrdersTable
              orders={orders}
              onView={handleView}
            />
          )}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-xs text-slate-500 font-medium">
              Página <span className="text-slate-900">{page}</span> de <span className="text-slate-900">{totalPages}</span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-50 disabled:hover:shadow-none transition-all"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm disabled:opacity-50 disabled:hover:shadow-none transition-all"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}