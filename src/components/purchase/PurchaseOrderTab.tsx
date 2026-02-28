"use client"

import { useEffect, useState } from "react"
import { PurchaseOrderServices } from "@/services/PurchaseOrderServices"
import type { PurchaseOrderDetail } from "@/interfaces/purchaseOrder"
import { 
    Download, FileText, Building2, 
    MapPin, CreditCard, Truck, AlertCircle, Loader2,
    Edit,
    XCircle,
    CheckCircle,
    Calendar
} from "lucide-react"
import { Button } from "../ui/button"
import EditOrderDialog from "./EditOrderDialog"

interface Props {
    orderId: number
}

// Helpers de formato (locales para el componente)
const formatCurrency = (amount: number, currency: string = 'CLP') => 
    new Intl.NumberFormat('es-CL', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)

const formatDate = (isoDate?: string) => 
    !isoDate ? "-" : new Date(isoDate).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })

export default function PurchaseOrderTab({ orderId }: Props) {
    const [order, setOrder] = useState<PurchaseOrderDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)

    // Estados para las acciones
    const [actionLoading, setActionLoading] = useState<string | null>(null) // Para saber qué botón está cargando
    const [editOpen, setEditOpen] = useState(false) // ✅ Aquí solucionamos el error del setEditOpen

    const fetchOrder = async () => {
        setLoading(true)
        const res = await PurchaseOrderServices.getById(orderId)
        if (res.success && res.data) {
            setOrder(res.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchOrder()
    }, [orderId])



    // Manejo de Aprobación ("Enviada") / Cancelación
    const handleStatusUpdate = async (newStatus: "Enviada" | "Cancelada") => {
        const confirmMsg = newStatus === "Enviada" 
            ? "¿Aprobar y Enviar esta Orden de Compra? No se podrá editar después."
            : "¿Estás seguro de Cancelar esta Orden de Compra?";

        if(!confirm(confirmMsg)) return;

        setActionLoading(newStatus);
        const res = await PurchaseOrderServices.updateStatus(orderId, newStatus);
        
        if(res.success) {
            await fetchOrder(); // Recargar datos para ver nuevo estado
        } else {
            alert(res.message || "Error al actualizar estado");
        }
        setActionLoading(null);
    }

    const handleDownloadPdf = async () => {
        if (!order) return
        setDownloading(true)
        const blob = await PurchaseOrderServices.downloadPdf(order.id)
        setDownloading(false)

        if (blob) {
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${order.orderNumber}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
        }
    }

    if (loading) return <div className="p-12 text-center text-slate-500 animate-pulse">Cargando orden de compra...</div>
    
    if (!order) return (
        <div className="p-8 text-center border rounded-2xl bg-slate-50 text-slate-500">
            <AlertCircle className="mx-auto h-8 w-8 mb-2" />
            No se pudo cargar la información de la orden.
        </div>
    )

    // Solo es editable si está en el estado inicial
    const isEditable = order.status === "Esperando Aprobación";

return (
        <div className="animate-in fade-in duration-500 space-y-6">
            
            {/* Header de Acciones */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-600/20">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">Orden Generada: {order.orderNumber}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2">
                            Estado: 
                            <span className={`font-semibold px-2 py-0.5 rounded-md text-xs border ${
                                order.status === "Esperando Aprobación" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                order.status === "Enviada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                order.status === "Cancelada" ? "bg-red-50 text-red-700 border-red-200" :
                                "bg-blue-50 text-blue-700 border-blue-200"
                            }`}>
                                {order.status}
                            </span>
                        </p>
                    </div>
                </div>
                
                <div className="flex flex-wrap gap-2 w-full xl:w-auto justify-end">
                    
                    {/* Botones de Acción (Solo si es editable) */}
                    {isEditable && (
                        <>
                            <Button 
                                variant="destructive" 
                                onClick={() => handleStatusUpdate("Cancelada")}
                                disabled={!!actionLoading}
                                className="bg-white text-red-600 border border-red-200 hover:bg-red-50"
                            >
                                {actionLoading === "Cancelada" ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <XCircle className="mr-2 h-4 w-4"/>}
                                Cancelar
                            </Button>

                            <Button 
                                variant="outline"
                                onClick={() => setEditOpen(true)}
                                disabled={!!actionLoading}
                                className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                            >
                                <Edit className="mr-2 h-4 w-4" /> Editar Datos
                            </Button>

                            <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20"
                                onClick={() => handleStatusUpdate("Enviada")}
                                disabled={!!actionLoading}
                            >
                                {actionLoading === "Enviada" ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <CheckCircle className="mr-2 h-4 w-4"/>}
                                Aprobar y Enviar
                            </Button>
                        </>
                    )}
                    
                    {/* Descarga siempre disponible si no está cancelada (o según regla) */}
                    <Button 
                        variant="default" 
                        className="bg-slate-900 text-white hover:bg-slate-800"
                        onClick={handleDownloadPdf}
                        disabled={downloading}
                    >
                        {downloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                        PDF
                    </Button>
                </div>
            </div>

            {/* Vista Previa del Documento */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Info Proveedor y Logística */}
                <div className="grid grid-cols-1 md:grid-cols-2 border-b border-slate-100">
                    <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                            <Building2 className="h-3.5 w-3.5" /> Proveedor
                        </h4>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-slate-900">{order.supplier.businessName}</p>
                            <p className="text-sm text-slate-500">{order.supplier.rut}</p>
                            <div className="mt-4 text-sm text-slate-600 space-y-1.5">
                                <p><span className="font-medium text-slate-800">Contacto:</span> {order.supplier.contactName || "-"}</p>
                                <p><span className="font-medium text-slate-800">Email:</span> {order.supplier.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4 flex items-center gap-2">
                            <Truck className="h-3.5 w-3.5" /> Logística
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoSmall icon={<MapPin className="text-blue-500"/>} label="Dirección" value={order.shippingAddress} />
                            <InfoSmall icon={<Calendar className="text-amber-500"/>} label="Entrega" value={order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Por coordinar"} />
                            <InfoSmall icon={<CreditCard className="text-emerald-500"/>} label="Pago" value={order.paymentForm} sub={order.paymentTerms} />
                        </div>
                    </div>
                </div>

                {/* Tabla de Productos */}
                <div className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 w-[40%]">Ítem</th>
                                <th className="px-6 py-3 text-center">Cant.</th>
                                <th className="px-6 py-3 text-right">Precio</th>
                                <th className="px-6 py-3 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {order.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                    <td className="px-6 py-4 text-center">{item.quantity} {item.unit}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{formatCurrency(item.unitPrice, order.currency)}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">{formatCurrency(item.totalPrice, order.currency)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Totales */}
                <div className="bg-slate-50 p-6 flex justify-end">
                    <div className="w-full md:w-1/3 space-y-2">
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>Subtotal</span>
                            <span>{formatCurrency(order.subTotal, order.currency)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-sm text-emerald-600">
                                <span>Descuento</span>
                                <span>- {formatCurrency(order.discount, order.currency)}</span>
                            </div>
                        )}
                        {order.freightCharge > 0 && (
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Flete</span>
                                <span>{formatCurrency(order.freightCharge, order.currency)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-slate-500">
                            <span>IVA ({order.taxRate}%)</span>
                            <span>{formatCurrency(order.taxAmount, order.currency)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t border-slate-200 mt-2">
                            <span>Total</span>
                            <span>{formatCurrency(order.totalAmount, order.currency)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de Edición (Siempre presente, controlado por editOpen) */}
            {order && (
                <EditOrderDialog 
                    open={editOpen}
                    onOpenChange={setEditOpen}
                    order={order}
                    onSuccess={() => {
                        fetchOrder(); // Recargar datos al editar exitosamente
                    }}
                />
            )}
        </div>
    )
}

function InfoSmall({ icon, label, value, sub }: { icon: any, label: string, value?: string, sub?: string }) {
    return (
        <div className="flex items-start gap-2">
            <div className="mt-0.5 h-4 w-4 shrink-0 [&>svg]:h-full [&>svg]:w-full">{icon}</div>
            <div>
                <p className="text-xs font-bold text-slate-400 uppercase">{label}</p>
                <p className="text-sm font-medium text-slate-900 truncate max-w-[120px]" title={value}>{value || "-"}</p>
                {sub && <p className="text-xs text-slate-500">{sub}</p>}
            </div>
        </div>
    )
}