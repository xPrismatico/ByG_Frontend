"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import type { PurchaseOrderSummary } from "@/interfaces/purchaseOrder"
import PurchaseOrdersTable from "@/components/purchaseOrder/PurchaseOrdersTable"
import PurchaseOrderFilters from "@/components/purchaseOrder/PurchaseOrderFilters"
import { cn } from "@/lib/utils"

// --- DATA FAKE (Simulando respuesta del Backend) ---
const MOCK_DATA: PurchaseOrderSummary[] = Array.from({ length: 45 }).map((_, i) => ({
  id: i + 1,
  orderNumber: `OC-2026-${String(45 - i).padStart(3, '0')}`,
  supplierName: i % 3 === 0 ? "Ferretería El Martillo SpA" : i % 3 === 1 ? "Comercializadora Minera Ltda" : "Importadora de Seguridad Global",
  projectName: i % 2 === 0 ? "Mantención Planta Chancado" : "Proyecto Expansión Norte",
  issueDate: new Date(2026, 1, 18 - (i % 20)).toISOString(), // Fechas variadas en Feb 2026
  totalAmount: (Math.floor(Math.random() * 50) + 1) * 150000,
  currency: "CLP",
  status: i === 0 ? "Emitida" : i % 5 === 0 ? "Cerrada" : i % 4 === 0 ? "Facturada" : "Recepcionada"
}));

export default function PurchaseOrdersPage() {
  const router = useRouter()
  
  // Estados de datos
  const [data, setData] = useState<PurchaseOrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  
  // Estados de Filtros
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState("date_desc")

  const pageSize = 10

  // Efecto que simula la llamada a la API con retardo
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      // --- LÓGICA DE FILTRADO LOCAL (Simulando Backend) ---
      let filtered = [...MOCK_DATA]

      // 1. Búsqueda
      if (search) {
        const term = search.toLowerCase()
        filtered = filtered.filter(item => 
          item.orderNumber.toLowerCase().includes(term) ||
          item.supplierName.toLowerCase().includes(term) ||
          item.projectName.toLowerCase().includes(term)
        )
      }

      // 2. Estado
      if (status) {
        filtered = filtered.filter(item => item.status === status)
      }

      // 3. Fechas
      if (startDate) {
        filtered = filtered.filter(item => item.issueDate >= startDate)
      }
      if (endDate) {
        // Ajustamos fin del día para comparación correcta
        const end = new Date(endDate)
        end.setHours(23, 59, 59)
        filtered = filtered.filter(item => new Date(item.issueDate) <= end)
      }

      // 4. Ordenamiento
      filtered.sort((a, b) => {
        switch (sortBy) {
          case "date_asc": return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
          case "amount_desc": return b.totalAmount - a.totalAmount
          case "amount_asc": return a.totalAmount - b.totalAmount
          default: return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime() // date_desc
        }
      })

      setData(filtered)
      setLoading(false)
    }, 600) // Simula 600ms de red

    return () => clearTimeout(timer)
  }, [search, status, startDate, endDate, sortBy])

  // Lógica de Paginación Local
  const totalItems = data.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)

  const handleView = (id: number) => {
    // router.push(`/orden-compra/${id}`)
    alert(`Navegar a detalle de OC #${id} (Aún no implementado)`)
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1C1C] flex items-center gap-2">
          <FileText className="h-6 w-6 text-[#E7313C]" /> Órdenes de Compra
        </h1>
        <p className="text-sm text-[#2F2F2F] mt-1">
          Historial y gestión de documentos formales emitidos a proveedores.
        </p>
      </div>

      {/* Filtros */}
      <PurchaseOrderFilters 
        search={search} onSearchChange={(v) => { setSearch(v); setPage(1); }}
        status={status} onStatusChange={(v) => { setStatus(v); setPage(1); }}
        startDate={startDate} onStartDateChange={(v) => { setStartDate(v); setPage(1); }}
        endDate={endDate} onEndDateChange={(v) => { setEndDate(v); setPage(1); }}
        sortBy={sortBy} onSortChange={(v) => { setSortBy(v); setPage(1); }}
        onClear={() => {
          setSearch(""); setStatus(""); setStartDate(""); setEndDate(""); setSortBy("date_desc"); setPage(1);
        }}
      />

      {/* Tabla Container */}
      <div className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#F2F2F2] flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-[#2F2F2F] uppercase tracking-widest flex items-center gap-2">
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {loading ? "Procesando..." : `${totalItems} Documentos encontrados`}
          </span>
        </div>

        <div className={cn("relative transition-opacity duration-300", loading ? "opacity-50" : "opacity-100")}>
          <PurchaseOrdersTable orders={paginatedData} onView={handleView} />
          
          {!loading && data.length === 0 && (
            <div className="py-20 text-center text-[#2F2F2F]">
              No se encontraron órdenes de compra con estos filtros.
            </div>
          )}
        </div>

        {/* Paginación */}
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
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#F2F2F2] text-[#2F2F2F] hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}