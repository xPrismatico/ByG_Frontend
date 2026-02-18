import type { PurchaseDetail } from "@/interfaces/purchase"

// Utilidad para formatear fechas (puedes moverla a un archivo utils general luego)
const formatFullDateTime = (isoDate: string) => {
  try {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(new Date(isoDate))
  } catch {
    return isoDate
  }
}

export default function GeneralInfoTab({ purchase }: { purchase: PurchaseDetail }) {
  return (
    <div className="bg-white rounded-2xl border border-[#F2F2F2] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#F2F2F2] bg-[#F2F2F2]/30">
        <h2 className="text-lg font-bold text-[#1C1C1C]">Detalles de la solicitud</h2>
        <p className="text-sm text-[#2F2F2F] mt-0.5">Información base enviada desde terreno.</p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <p className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider mb-1">Solicitante</p>
          <p className="text-sm font-medium text-[#1C1C1C]">{purchase.requester}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider mb-1">Proyecto / Obra</p>
          <p className="text-sm font-medium text-[#1C1C1C]">{purchase.projectName}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider mb-1">Fecha de Solicitud</p>
          <p className="text-sm text-[#1C1C1C]">{formatFullDateTime(purchase.requestDate)}</p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider mb-1">Última Actualización</p>
          <p className="text-sm text-[#1C1C1C]">{formatFullDateTime(purchase.updatedAt)}</p>
        </div>

        <div className="md:col-span-2">
          <p className="text-xs font-semibold text-[#2F2F2F] uppercase tracking-wider mb-1">Observaciones</p>
          {purchase.observations ? (
            <div className="bg-[#F2F2F2]/50 p-4 rounded-xl text-sm text-[#1C1C1C] whitespace-pre-wrap border border-[#F2F2F2]">
              {purchase.observations}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Sin observaciones adicionales.</p>
          )}
        </div>
      </div>
    </div>
  )
}