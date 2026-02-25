"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PurchaseOrderServices } from "@/services/PurchaseOrderServices"
import type { PurchaseOrderDetail } from "@/interfaces/purchaseOrder"
import { 
    ArrowLeft, Download, FileText, Calendar, Building2, 
    MapPin, CreditCard, Truck, UserCheck, AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    orderId: number
}

// Helpers de Formato
const formatCurrency = (amount: number, currency: string = 'CLP') => {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0
    }).format(amount)
}

const formatDate = (isoDate?: string) => {
    if (!isoDate) return "-"
    return new Date(isoDate).toLocaleDateString('es-CL', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
}

export default function PurchaseOrderDetailPage({ orderId }: Props) {
    const router = useRouter()
    const [order, setOrder] = useState<PurchaseOrderDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [downloading, setDownloading] = useState(false)

    // Cargar datos
    useEffect(() => {
        let alive = true
        async function fetchOrder() {
            setLoading(true)
            const res = await PurchaseOrderServices.getById(orderId)
            
            if (!alive) return
            
            if (res.success && res.data) {
                setOrder(res.data)
            } else {
                setErrorMsg(res.message || "No se pudo cargar la orden de compra.")
            }
            setLoading(false)
        }
        fetchOrder()
        return () => { alive = false }
    }, [orderId])

    // Manejar descarga de PDF
    const handleDownloadPdf = async () => {
        if (!order) return;
        setDownloading(true);
        
        // Llamada al servicio que retorna un Blob
        const blob = await PurchaseOrderServices.downloadPdf(order.id);
        
        setDownloading(false);

        if (blob) {
            // Crear URL temporal y forzar descarga
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${order.orderNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } else {
            alert("No se pudo descargar el PDF. Verifique que el servidor tenga la funcionalidad implementada.");
        }
    };

    // Estado de Carga Inicial
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3 animate-pulse">
                    <div className="h-12 w-12 rounded-full bg-slate-200"></div>
                    <div className="text-sm text-slate-500 font-medium">Cargando documento...</div>
                </div>
            </div>
        )
    }

    // Estado de Error
    if (errorMsg || !order) {
        return (
            <div className="p-10 flex flex-col items-center justify-center h-screen bg-slate-50">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Error al cargar</h2>
                <p className="text-slate-500 mb-6">{errorMsg}</p>
                <button 
                    onClick={() => router.back()}
                    className="px-5 py-2.5 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-sm"
                >
                    Volver atrás
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-100/50 p-6 md:p-10 pb-20 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-6">
                
                {/* --- Barra Superior de Navegación --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-slate-500 hover:text-blue-700 transition-colors text-sm font-medium w-fit group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                        Volver al listado
                    </button>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={handleDownloadPdf}
                            disabled={downloading}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 disabled:opacity-70 text-sm font-medium active:scale-95"
                        >
                            {downloading ? (
                                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"/>
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            {downloading ? "Generando..." : "Descargar PDF"}
                        </button>
                    </div>
                </div>

                {/* --- TARJETA DEL DOCUMENTO (El "Papel") --- */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    
                    {/* Header del Documento */}
                    <div className="bg-slate-50/50 p-6 md:p-10 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-start gap-6">
                        <div className="flex gap-5">
                            <div className="p-3.5 bg-blue-600 rounded-2xl text-white h-fit shadow-lg shadow-blue-600/20">
                                <FileText className="h-8 w-8" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{order.orderNumber}</h1>
                                <p className="text-slate-500 text-sm font-medium mt-0.5">Orden de Compra</p>
                                
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className={cn(
                                        "px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide border",
                                        order.status === "Emitida" ? "bg-blue-50 text-blue-700 border-blue-200" :
                                        order.status === "Cerrada" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                        "bg-slate-100 text-slate-600 border-slate-200"
                                    )}>
                                        {order.status}
                                    </span>
                                    <span className="text-xs text-slate-300">|</span>
                                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                                        Ref: {order.purchaseNumber}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="text-left md:text-right space-y-1">
                            <div className="text-sm text-slate-500 font-medium">Fecha de Emisión</div>
                            <div className="text-xl font-bold text-slate-900 flex items-center md:justify-end gap-2">
                                <Calendar className="h-5 w-5 text-slate-400" />
                                {formatDate(order.date)}
                            </div>
                            <div className="text-sm text-blue-600 font-medium mt-1 max-w-[250px] md:ml-auto truncate">
                                {order.projectName}
                            </div>
                        </div>
                    </div>

                    {/* Cuerpo del Documento */}
                    <div className="p-6 md:p-10 space-y-10">
                        
                        {/* 1. Bloque Superior: Proveedor y Logística */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            
                            {/* Columna Izquierda: Proveedor */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                    <Building2 className="h-3.5 w-3.5" />
                                    Datos del Proveedor
                                </h3>
                                <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
                                    <div className="font-bold text-slate-900 text-lg">{order.supplier.businessName}</div>
                                    <div className="text-sm text-slate-500 mt-1 font-mono">{order.supplier.rut}</div>
                                    
                                    <div className="mt-5 space-y-3 text-sm text-slate-600">
                                        <InfoRow label="Contacto" value={order.supplier.contactName} />
                                        <InfoRow label="Email" value={order.supplier.email} />
                                        <InfoRow label="Teléfono" value={order.supplier.phone} />
                                        <InfoRow label="Dirección" value={order.supplier.address ? `${order.supplier.address}, ${order.supplier.city}` : null} />
                                    </div>
                                </div>
                            </div>

                            {/* Columna Derecha: Logística y Pago */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-2">
                                    <Truck className="h-3.5 w-3.5" />
                                    Logística y Pago
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InfoBox 
                                        icon={<MapPin className="h-4 w-4 text-blue-500" />}
                                        label="Dirección de Envío"
                                        value={order.shippingAddress || "Dirección Principal ByG"}
                                    />
                                    <InfoBox 
                                        icon={<CreditCard className="h-4 w-4 text-emerald-500" />}
                                        label="Forma de Pago"
                                        value={order.paymentForm || "No especificado"}
                                        subValue={order.paymentTerms}
                                    />
                                    <InfoBox 
                                        icon={<Calendar className="h-4 w-4 text-amber-500" />}
                                        label="Entrega Estimada"
                                        value={order.expectedDeliveryDate ? formatDate(order.expectedDeliveryDate) : "Por coordinar"}
                                    />
                                    <InfoBox 
                                        icon={<Truck className="h-4 w-4 text-purple-500" />}
                                        label="Método de Envío"
                                        value={order.shippingMethod || "Despacho por proveedor"}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. Tabla de Productos */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Detalle de Productos</h3>
                            <div className="rounded-xl border border-slate-200 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 w-[40%]">Ítem / Descripción</th>
                                            <th className="px-6 py-4 text-center">Unidad</th>
                                            <th className="px-6 py-4 text-center">Cant.</th>
                                            <th className="px-6 py-4 text-right">Precio Unit.</th>
                                            <th className="px-6 py-4 text-right bg-slate-100/50">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {order.items.map((item, index) => (
                                            <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{item.name}</div>
                                                    {item.description && (
                                                        <div className="text-xs text-slate-500 mt-1">{item.description}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center text-slate-600">{item.unit}</td>
                                                <td className="px-6 py-4 text-center font-medium text-slate-900">{item.quantity}</td>
                                                <td className="px-6 py-4 text-right text-slate-600 tabular-nums">
                                                    {formatCurrency(item.unitPrice, order.currency)}
                                                </td>
                                                <td className="px-6 py-4 text-right font-bold text-slate-800 bg-slate-50/50 tabular-nums">
                                                    {formatCurrency(item.totalPrice, order.currency)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 3. Footer: Totales y Observaciones */}
                        <div className="flex flex-col lg:flex-row gap-10 pt-2">
                            
                            {/* Izquierda: Observaciones y Firmas */}
                            <div className="flex-1 space-y-6">
                                {order.observations && (
                                    <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-900">
                                        <div className="font-bold mb-2 flex items-center gap-2 text-amber-700">
                                            <AlertCircle className="h-4 w-4" /> Observaciones
                                        </div>
                                        <p className="leading-relaxed opacity-90">{order.observations}</p>
                                    </div>
                                )}
                                
                                {/* Aprobación */}
                                <div className="pt-6 flex items-start gap-4">
                                    <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                        <UserCheck className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Autorizado digitalmente por</div>
                                        <div className="font-bold text-slate-900 text-base">{order.approverName || "Sistema Automático"}</div>
                                        <div className="text-sm text-slate-500 mt-0.5">
                                            {order.approverRole || "Gestión de Compras"} • {formatDate(order.signedAt)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Derecha: Desglose Financiero */}
                            <div className="w-full lg:w-96 space-y-3">
                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-3">
                                    <SummaryRow label="Subtotal Neto" value={formatCurrency(order.subTotal, order.currency)} />
                                    
                                    {order.discount > 0 && (
                                        <SummaryRow 
                                            label="Descuentos" 
                                            value={`- ${formatCurrency(order.discount, order.currency)}`} 
                                            className="text-emerald-600" 
                                        />
                                    )}
                                    
                                    {order.freightCharge > 0 && (
                                        <SummaryRow label="Flete" value={formatCurrency(order.freightCharge, order.currency)} />
                                    )}
                                    
                                    <div className="border-t border-slate-200 my-2 pt-3">
                                        <SummaryRow label="Monto Neto" value={formatCurrency(order.subTotal - order.discount + order.freightCharge, order.currency)} />
                                        <SummaryRow label={`IVA (${order.taxRate}%)`} value={formatCurrency(order.taxAmount, order.currency)} />
                                    </div>
                                </div>

                                <div className="bg-slate-900 text-white p-6 rounded-2xl flex justify-between items-center shadow-xl shadow-slate-900/10">
                                    <div className="text-slate-300 text-sm font-medium">Total a Pagar</div>
                                    <div className="text-2xl font-bold tracking-tight">{formatCurrency(order.totalAmount, order.currency)}</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                
                <div className="text-center text-xs text-slate-400 pb-6">
                    Documento generado digitalmente por Sistema de Compras ByG Ingeniería
                </div>
            </div>
        </div>
    )
}

// --- Componentes Auxiliares para limpieza de código ---

function InfoRow({ label, value }: { label: string, value: string | null | undefined }) {
    if (!value) return null;
    return (
        <div className="flex gap-2">
            <span className="font-medium text-slate-700 min-w-[70px]">{label}:</span> 
            <span className="text-slate-600">{value}</span>
        </div>
    )
}

function InfoBox({ icon, label, value, subValue }: { icon: React.ReactNode, label: string, value: string, subValue?: string }) {
    return (
        <div className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1.5">
                {icon}
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">{label}</span>
            </div>
            <div className="font-medium text-slate-800 text-sm truncate" title={value}>{value}</div>
            {subValue && <div className="text-xs text-slate-500 mt-0.5 truncate">{subValue}</div>}
        </div>
    )
}

function SummaryRow({ label, value, className }: { label: string, value: string, className?: string }) {
    return (
        <div className={cn("flex justify-between text-sm", className)}>
            <span className="text-slate-500 font-medium">{label}</span>
            <span className="font-bold text-slate-900 tabular-nums">{value}</span>
        </div>
    )
}