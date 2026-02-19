"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PurchaseDetail } from "@/interfaces/purchase"
import { PurchaseServices } from "@/services/PurchaseServices"
import { ArrowLeft, AlertCircle, FileText, Upload, ShoppingCart, ClipboardList, BadgeCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import GeneralInfoTab from "@/components/purchase/GeneralInfoTab"
import ProductsTab from "@/components/purchase/ProductsTab"

interface Props {
  purchaseId: number
}

export default function PurchaseDetailsPage({ purchaseId }: Props) {
  const router = useRouter()
  const [purchase, setPurchase] = useState<PurchaseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Tabs extendidos para incluir la Solicitud
  const [activeTab, setActiveTab] = useState<"general" | "products" | "request" | "quotes" | "order">("general")

  useEffect(() => {
    let alive = true
    async function fetchDetails() {
      setLoading(true)
      const res = await PurchaseServices.getPurchaseById(purchaseId)
      if (!alive) return
      if (res.success && res.data) {
        setPurchase(res.data)
      } else {
        setErrorMsg(res.message || "Error al cargar los detalles de la compra.")
      }
      setLoading(false)
    }
    fetchDetails()
    return () => { alive = false }
  }, [purchaseId])

  if (loading) return <div className="flex justify-center items-center h-64 text-[#2F2F2F]">Cargando detalles de la compra...</div>

  if (errorMsg || !purchase) {
    return (
      <div className="p-6 max-w-[1200px] mx-auto">
        <button onClick={() => router.push('/compra')} className="flex items-center gap-2 text-[#2F2F2F] hover:text-[#1C1C1C] mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver a Compras
        </button>
        <div className="flex items-center gap-2 rounded-xl border border-[#E7313C] bg-red-50 p-4 text-[#E7313C]">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p className="font-medium">{errorMsg || "No se encontró la compra."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6 max-w-[1400px] mx-auto w-full animate-in fade-in duration-500">
      
      {/* Botón de retroceso sutil */}
      <button 
        onClick={() => router.push('/compra')} 
        className="flex items-center gap-2 text-[#2F2F2F] hover:text-[#E7313C] w-fit text-sm font-medium transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        Volver al listado
      </button>

      {/* Header con Paleta de Colores Corporativa */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#FFFFFF] p-8 rounded-3xl border border-[#F2F2F2] shadow-sm">
        
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#1C1C1C] tracking-tight">
              Solicitud {purchase.purchaseNumber}
            </h1>
            <span className={cn(
              "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border",
              purchase.status === "Rechazada" ? "bg-red-50 text-[#E7313C] border-[#E7313C]/20" : "bg-slate-50 text-slate-600 border-slate-200"
            )}>
              {purchase.status}
            </span>
          </div>
          <p className="text-[#2F2F2F] font-medium text-lg">{purchase.projectName}</p>
        </div>

        {/* Acciones principales - Botón Rojo Destacado */}

        <div className="flex flex-wrap gap-3">
          {purchase.status === "Solicitud de cotización enviada" && (
            <button className="flex items-center gap-2 rounded-xl bg-[#E7313C] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/20 hover:bg-[#c92a34] transition-all active:scale-95">
              <Upload className="h-4 w-4" /> Subir Cotización de Proveedor
            </button>
          )}
        </div>

      </div>

      {/* Navegación por Iconos + Texto para mejor UX */}

      <div className="flex overflow-x-auto border-b border-[#F2F2F2] gap-2">

        <TabButton active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<ClipboardList className="h-4 w-4" />}>
          General
        </TabButton>

        <TabButton active={activeTab === "products"} onClick={() => setActiveTab("products")} icon={<ShoppingCart className="h-4 w-4" />}>
          Productos ({purchase.purchaseItems.length})
        </TabButton>

        <TabButton active={activeTab === "request"} onClick={() => setActiveTab("request")} icon={<FileText className="h-4 w-4" />}>
          Solicitud de Cotiz.
        </TabButton>

        <TabButton active={activeTab === "quotes"} onClick={() => setActiveTab("quotes")} icon={<BadgeCheck className="h-4 w-4" />}>
          Cotizaciones Recibidas
        </TabButton>

        {purchase.hasPurchaseOrder && (
          <TabButton active={activeTab === "order"} onClick={() => setActiveTab("order")} icon={<FileText className="h-4 w-4" />}>
            Orden de Compra
          </TabButton>
        )}

      </div>

      {/* Contenido Dinámico */}
      <div className="min-h-[400px]">

        {activeTab === "general" && <GeneralInfoTab purchase={purchase} />}
        {activeTab === "products" && <ProductsTab items={purchase.purchaseItems} />}
        
        {/* Sección de Solicitud de Cotización para mostrar la Solicitud y sus Proveedores a quienes se envió */}
        {activeTab === "request" && (
          <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-[#2F2F2F] space-y-4">
            <div className="p-4 bg-slate-50 rounded-full"><FileText className="h-12 w-12 text-slate-400" /></div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#1C1C1C]">Solicitud de Cotización (RFQ)</h3>
              <p className="max-w-md mx-auto mt-2 text-slate-500">Aquí se visualizará el documento PDF generado automáticamente y el listado de proveedores a los que se les envió la solicitud.</p>
            </div>
          </div>
        )}


        {/* Sección de Autorizar Cotizaciones para aprobar una Compra. */}
        {activeTab === "quotes" && (
          <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-[#2F2F2F] space-y-4">
            <div className="p-4 bg-slate-50 rounded-full"><BadgeCheck className="h-12 w-12 text-slate-400" /></div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-[#1C1C1C]">Panel de Comparación de Cotizaciones</h3>
              <p className="max-w-md mx-auto mt-2 text-slate-500">En esta sección el Autorizador podrá comparar los precios ingresados y los archivos adjuntos para aprobar una compra.</p>
            </div>
          </div>
        )}

      </div>

    </div>
  )
}

function TabButton({ active, onClick, children, icon }: { active: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 whitespace-nowrap py-4 px-6 text-sm font-bold transition-all border-b-2 relative",
        active 
          ? "text-[#E7313C] border-[#E7313C]" 
          : "text-[#2F2F2F] border-transparent hover:text-[#1C1C1C] hover:bg-[#F2F2F2]/50 rounded-t-xl"
      )}
    >
      {icon}
      {children}
    </button>
  )
}