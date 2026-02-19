"use client"

import { useEffect, useState } from "react"
import type { SupplierSummary, SupplierDetail, SupplierUpdate } from "@/interfaces/supplier" // Importar Detail y Update
import { Plus } from "lucide-react"
import { SupplierService } from "@/services/SupplierServices"
import SuppliersTable from "@/components/supplier/SuppliersTable"
import SupplierUpsertDialog, { SupplierUpsertValues } from "@/components/supplier/SupplierUpsertDialog"
import SupplierDetailsDialog from "@/components/supplier/SupplierDetailsDialog"

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SupplierSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Estados para el Modal de Crear/Editar
  const [upsertOpen, setUpsertOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<SupplierDetail | null>(null)

    // Estados para el Modal de Ver Detalles
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierDetail | null>(null)

  // Estados para prevenir doble clicks
  const [togglingIds, setTogglingIds] = useState<Set<number>>(new Set())
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  // Cargar lista inicial
  useEffect(() => {
    let alive = true

    async function loadData() {
      setLoading(true)
      const res = await SupplierService.getSuppliers()
      
      if (!alive) return

      if (res.success && res.data) {
        setSuppliers(res.data)
      } else {
        setErrorMsg(res.message || "Error al cargar los proveedores.")
      }
      setLoading(false)
    }

    loadData()

    return () => {
      alive = false
    }
  }, [])

  // Cambiar estado Activo/Inactivo (Optimistic Update)
  async function handleToggleActive(supplier: SupplierSummary) {
    if (togglingIds.has(supplier.id)) return

    setTogglingIds((prev) => new Set(prev).add(supplier.id))
    setErrorMsg(null)

    const previousSuppliers = [...suppliers]
    setSuppliers((prev) =>
      prev.map((s) => (s.id === supplier.id ? { ...s, isActive: !s.isActive } : s))
    )

    const res = await SupplierService.toggleSupplierStatus(supplier.id)

    if (!res.success) {
      setSuppliers(previousSuppliers)
      setErrorMsg(res.errors?.[0] || "No se pudo actualizar el estado del proveedor.")
    }

    setTogglingIds((prev) => {
      const next = new Set(prev)
      next.delete(supplier.id)
      return next
    })
  }

  // Eliminar (Hard Delete)
  async function handleDelete(supplier: SupplierSummary) {
    if (deletingIds.has(supplier.id)) return

    setDeletingIds((prev) => new Set(prev).add(supplier.id))
    setErrorMsg(null)

    const res = await SupplierService.deleteSupplier(supplier.id)

    if (!res.success) {
      setErrorMsg(res.errors?.[0] || "No se pudo eliminar el proveedor.")
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(supplier.id)
        return next
      })
      return
    }

    setSuppliers((prev) => prev.filter((s) => s.id !== supplier.id))

    setDeletingIds((prev) => {
      const next = new Set(prev)
      next.delete(supplier.id)
      return next
    })
  }

    // Lógica completa para Ver Detalle
  async function handleView(supplier: SupplierSummary) {
    setErrorMsg(null)
    
    // Traemos el detalle completo desde el backend
    const res = await SupplierService.getSupplierById(supplier.id)
    
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar el detalle del proveedor.")
      return
    }

    setSelectedSupplier(res.data)
    setDetailsOpen(true)
  }

  // Lógica completa para Editar
  async function handleEdit(supplier: SupplierSummary) {
    setErrorMsg(null)
    
    // Traemos el detalle completo desde el backend antes de abrir el modal
    const res = await SupplierService.getSupplierById(supplier.id)
    
    if (!res.success || !res.data) {
      setErrorMsg(res.errors?.[0] || "No se pudo cargar la información del proveedor.")
      return
    }

    setEditingSupplier(res.data)
    setUpsertOpen(true)
  }

    // Lógica para enviar los datos del Formulario al Backend
  // AHORA DEVUELVE UNA PROMESA PARA QUE EL MODAL SEPA QUÉ PASÓ
  async function handleUpsertSubmit(payload: SupplierUpsertValues): Promise<{ success: boolean; errorMsg?: string }> {
    
    if (payload.mode === "create") {
      const res = await SupplierService.createSupplier(payload)
      
      if (!res.success || !res.data) {
        // En lugar de setErrorMsg general, devolvemos el error al Modal
        return { success: false, errorMsg: res.errors?.[0] || "No se pudo crear el proveedor." }
      }

      const newSummary: SupplierSummary = {
        id: res.data.id,
        rut: res.data.rut,
        businessName: res.data.businessName,
        email: res.data.email,
        productCategories: res.data.productCategories,
        isActive: res.data.isActive,
      }

      setSuppliers((prev) => [newSummary, ...prev])
      setUpsertOpen(false)
      setEditingSupplier(null)
      return { success: true }

    } else {
      if (!editingSupplier) return { success: false, errorMsg: "Error interno" }

      const updatePayload: SupplierUpdate = {
        rut: payload.rut,
        businessName: payload.businessName,
        contactName: payload.contactName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        city: payload.city,
        productCategories: payload.productCategories,
        isActive: editingSupplier.isActive,
      }

      const res = await SupplierService.updateSupplier(editingSupplier.id, updatePayload)

      if (!res.success || !res.data) {
        return { success: false, errorMsg: res.errors?.[0] || "No se pudo actualizar el proveedor." }
      }

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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Proveedores</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestiona los contactos y categorías de empresas proveedoras.
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          // Al hacer click en "Nuevo", limpiamos edición y abrimos modal
          onClick={() => {
            setEditingSupplier(null)
            setUpsertOpen(true)
          }}
        >
          <Plus className="h-5 w-5" />
          Nuevo Proveedor
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {loading ? (
        <div className="flex h-40 items-center justify-center rounded-2xl border bg-white text-slate-500">
          Cargando proveedores...
        </div>
      ) : suppliers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 rounded-2xl border bg-white text-slate-500">
          <p>No hay proveedores registrados aún.</p>
        </div>
      ) : (
        <SuppliersTable
          suppliers={suppliers}
          onView={handleView}
          onEdit={handleEdit} // Conectamos la función handleEdit
          onToggleActive={handleToggleActive}
          onDelete={handleDelete}
        />
      )}

      {/*  Instanciamos el Dialog al final del componente */}
      <SupplierUpsertDialog
        open={upsertOpen}
        onOpenChange={(open: boolean) => { // <--- SOLUCIÓN: Agregamos ": boolean" aquí
          setUpsertOpen(open)
          // Si se cierra, limpiamos el estado de edición por si acaso
          if (!open) setEditingSupplier(null)
        }}
        supplier={editingSupplier}
        onSubmit={handleUpsertSubmit}
      />

        {/* Instanciamos el Dialog de Detalles al final */}
      <SupplierDetailsDialog
        open={detailsOpen}
        onOpenChange={(open: boolean) => {
          setDetailsOpen(open)
          if (!open) setSelectedSupplier(null) // Limpiamos al cerrar
        }}
        supplier={selectedSupplier}
      />
    </div>
  )
}