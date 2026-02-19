"use client"

import { useEffect, useState } from "react"
import type { SupplierSummary, SupplierDetail, SupplierUpdate } from "@/interfaces/supplier"
import { Plus, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { SupplierService } from "@/services/SupplierServices"
import SuppliersTable from "@/components/supplier/SuppliersTable"
import SupplierUpsertDialog, { SupplierUpsertValues } from "@/components/supplier/SupplierUpsertDialog"
import SupplierDetailsDialog from "@/components/supplier/SupplierDetailsDialog"
import SupplierFilters from "@/components/supplier/SupplierFilters" // Importamos el nuevo componente
import { cn } from "@/lib/utils"

export default function SuppliersPage() {
  // Datos de la tabla
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // --- Estados de Paginación y Filtros ---
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [pageSize] = useState(15)

  const [search, setSearch] = useState("")
  const [isActive, setIsActive] = useState("") // "true", "false", ""
  const [category, setCategory] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sortBy, setSortBy] = useState("date_desc")

  // Estados para Modales
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<SupplierDetail | null>(null)
  
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail | null>(null)

  // Prevención de doble clicks y estados de carga de acciones
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())
  const [editingId, setEditingId] = useState<number | null>(null)

  // Cargar datos con Debounce
  useEffect(() => {
    let alive = true
    const delayDebounceFn = setTimeout(() => {
      async function loadData() {
        setLoading(true)
        setErrorMsg(null)
        
        // Convertir el string isActive a booleano real o dejarlo undefined para el service
        let activeParam: boolean | undefined = undefined;
        if (isActive === "true") activeParam = true;
        if (isActive === "false") activeParam = false;

        const res = await SupplierService.getSuppliers({
          search,
          isActive: activeParam,
          productCategory: category,
          startDate,
          endDate,
          sortBy,
          pageNumber: page,
          pageSize
        })
        
        if (!alive) return

        if (res.success && res.data) {
          setSuppliers(res.data.items || [])
          setTotalPages(res.data.totalPages || 1)
          setTotalItems(res.data.totalItems || 0)
        } else {
          setErrorMsg(res.message || "Error al cargar los proveedores.")
          setSuppliers([])
        }
        setLoading(false)
      }
      loadData()
    }, 350) // 350ms de espera al tipear

    return () => {
      alive = false
      clearTimeout(delayDebounceFn)
    }
  }, [search, isActive, category, startDate, endDate, sortBy, page, pageSize])

  // Helper para resetear página al filtrar
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(1);
  }

  // --- Acciones de la Tabla ---

  async function handleToggleActive(supplier: SupplierSummary) {
    if (togglingIds.has(supplier.id)) return
    setTogglingIds((prev) => new Set(prev).add(supplier.id))
    setErrorMsg(null)

    // Optimistic Update visual
    const previousSuppliers = [...suppliers]
    setSuppliers((prev) => prev.map((s) => (s.id === supplier.id ? { ...s, isActive: !s.isActive } : s)))

    const res = await SupplierService.toggleSupplierStatus(supplier.id)

    if (!res.success) {
      setSuppliers(previousSuppliers) // Revertir si falla
      setErrorMsg(res.errors?.[0] || "No se pudo actualizar el estado.")
    }

    setTogglingIds((prev) => { const next = new Set(prev); next.delete(supplier.id); return next })
  }

  async function handleDelete(supplier: SupplierSummary) {
    if (deletingIds.has(supplier.id)) return
    setDeletingIds((prev) => new Set(prev).add(supplier.id))
    setErrorMsg(null)

    const res = await SupplierService.deleteSupplier(supplier.id)

    if (!res.success) {
      setErrorMsg(res.errors?.[0] || "No se pudo eliminar el proveedor.")
      setDeletingIds((prev) => { const next = new Set(prev); next.delete(supplier.id); return next })
      return
    }

    setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id))
    setTotalItems(prev => prev - 1)
    setDeletingIds((prev) => { const next = new Set(prev); next.delete(supplier.id); return next })
  }

  async function handleView(supplier: SupplierSummary) {
    setErrorMsg(null)
    const res = await SupplierService.getSupplierById(supplier.id)
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar el detalle del proveedor.")
      return
    }
    setSelectedSupplier(res.data)
    setDetailsOpen(true)
  }

  async function handleEdit(supplier: SupplierSummary) {
    if (editingId) return; // Prevenir doble click
    setEditingId(supplier.id);
    setErrorMsg(null);
    
    const res = await SupplierService.getSupplierById(supplier.id);
    
    setEditingId(null);
    
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar la información del proveedor.");
      return;
    }
    setEditingSupplier(res.data)
    setUpsertOpen(true)
  }

  async function handleUpsertSubmit(payload: SupplierUpsertValues): Promise<{ success: boolean; errorMsg?: string }> {
    if (payload.mode === "create") {
      const res = await SupplierService.createSupplier(payload)
      
      if (!res.success || !res.data) {
        return { success: false, errorMsg: res.errors?.[0] || "Error al crear el proveedor." }
      }

      // Al crear, forzamos recarga o agregamos manualmente
      // Para simplificar y mantener orden correcto, hacemos un refetch rápido o insertamos al inicio
      const newSummary: SupplierSummary = {
        id: res.data.id,
        rut: res.data.rut,
        businessName: res.data.businessName,
        email: res.data.email,
        productCategories: res.data.productCategories,
        isActive: res.data.isActive,
      }
      setSuppliers((prev) => [newSummary, ...prev])
      setTotalItems(prev => prev + 1)
      setUpsertOpen(false)
      setEditingSupplier(null)
      return { success: true }

    } else {
      if (!editingSupplier) return { success: false, errorMsg: "Error interno" }

      const updatePayload: SupplierUpdate = {
        rut: payload.rut, businessName: payload.businessName, contactName: payload.contactName,
        email: payload.email, phone: payload.phone, address: payload.address,
        city: payload.city, productCategories: payload.productCategories,
        isActive: editingSupplier.isActive,
      }

      const res = await SupplierService.updateSupplier(editingSupplier.id, updatePayload)

      if (!res.success || !res.data) {
        return { success: false, errorMsg: res.errors?.[0] || "No se pudo actualizar el proveedor." }
      }

      // Actualizar fila localmente
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingSupplier.id ? {
          ...s,
          rut: res.data!.rut,
          businessName: res.data!.businessName,
          email: res.data!.email,
          productCategories: res.data!.productCategories,
        } : s))
      )
      setUpsertOpen(false)
      setEditingSupplier(null)
      return { success: true }
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1C1C]">Gestión de Proveedores</h1>
          <p className="text-sm text-[#2F2F2F] mt-1">
            Administra el catálogo de empresas y contactos.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingSupplier(null)
            setUpsertOpen(true)
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#E7313C] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#c92a34] transition-all active:scale-95"
        >
          <Plus className="h-5 w-5" />
          Nuevo Proveedor
        </button>
      </div>

      {/* Componente de Filtros */}
      <SupplierFilters 
        search={search} onSearchChange={(v) => handleFilterChange(setSearch, v)}
        isActive={isActive} onStatusChange={(v) => handleFilterChange(setIsActive, v)}
        category={category} onCategoryChange={(v) => handleFilterChange(setCategory, v)}
        startDate={startDate} onStartDateChange={(v) => handleFilterChange(setStartDate, v)}
        endDate={endDate} onEndDateChange={(v) => handleFilterChange(setEndDate, v)}
        sortBy={sortBy} onSortChange={(v) => handleFilterChange(setSortBy, v)}
        onClear={() => {
          setSearch(""); setIsActive(""); setCategory(""); setStartDate(""); setEndDate(""); setSortBy("date_desc"); setPage(1);
        }}
      />

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-[#E7313C] bg-red-50 p-4 text-sm text-[#E7313C]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{errorMsg}</p>
        </div>
      )}

      <div className="flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#F2F2F2] flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-bold text-[#2F2F2F] uppercase tracking-widest flex items-center gap-2">
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            {loading ? "Actualizando..." : `${totalItems} Proveedores encontrados`}
          </span>
        </div>

        <div className={cn("relative transition-opacity duration-300", loading ? "opacity-50" : "opacity-100")}>
          <SuppliersTable
            suppliers={suppliers}
            onView={handleView}
            onEdit={handleEdit}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
            // editingId={editingId} -> Si agregas el prop editingId a SuppliersTable, pásalo aquí
          />
          
          {(suppliers?.length === 0 || !suppliers) && !loading && (
            <div className="py-20 text-center text-[#2F2F2F]">
              No se encontraron proveedores que coincidan con los filtros.
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

      {/* Modales */}
      <SupplierUpsertDialog 
        open={upsertOpen} 
        onOpenChange={(open: boolean) => { 
          setUpsertOpen(open)
          if (!open) setEditingSupplier(null) 
        }} 
        supplier={editingSupplier} 
        onSubmit={handleUpsertSubmit} 
      />
      
      <SupplierDetailsDialog 
        open={detailsOpen} 
        onOpenChange={(open: boolean) => { 
          setDetailsOpen(open)
          if (!open) setSelectedSupplier(null) 
        }} 
        supplier={selectedSupplier} 
      />
    </div>
  )
}