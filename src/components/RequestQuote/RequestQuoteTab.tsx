"use client"

import { useState } from "react"
import { FileText, Loader2, Download, Calendar, Users, AlertCircle } from "lucide-react"
import { RequestQuote } from "@/interfaces/RequesQuote"
import { requestQuoteService } from "@/services/RequestQuoteServices"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

// 1. Cambiamos la interfaz de Props para recibir DATA, no ID
interface Props {
  data: RequestQuote | null;
}

export default function RequestQuoteTab({ data }: Props) {
  // ELIMINAMOS TODOS LOS USEEFFECT Y ESTADOS DE LOADING
  const [isDownloading, setIsDownloading] = useState(false)

  // 2. Si no hay data (null), mostramos mensaje de vacío INMEDIATAMENTE
  if (!data) return (
    <div className="bg-white p-12 rounded-3xl border border-[#F2F2F2] flex flex-col items-center justify-center text-slate-500 animate-in fade-in">
      <AlertCircle className="h-12 w-12 mb-4 text-slate-300" />
      <p className="text-lg font-medium">No se ha generado una solicitud de cotización formal aún.</p>
    </div>
  )

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Usamos la data que viene por props, ya no 'request' del state
      const pdfPayload = {
        Compra: {
           PurchaseNumber: "REQ-...", // Puedes ajustar esto con props si hace falta
           ProjectName: "Proyecto...",
           Requester: "Usuario...",
           PurchaseItems: [] 
        },
        Solicitud: {
          Number: data.number,
          Status: data.status
        }
      };

      const base64Data = await requestQuoteService.generatePdf(pdfPayload);
      const linkSource = `data:application/pdf;base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = `Solicitud_${data.number}.pdf`;
      downloadLink.click();

    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al generar el PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 3. Renderizamos la UI directamente usando 'data'
  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-[#F2F2F2] shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-5 bg-slate-50 rounded-2xl">
            <FileText className="h-12 w-12 text-slate-400" />
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h3 className="text-2xl font-bold text-[#1C1C1C]">Solicitud N° {data.number}</h3>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1">
                {data.status}
              </Badge>
            </div>
            <p className="text-slate-500 text-sm">
               Documento disponible para descarga oficial.
            </p>
          </div>

          <Button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="bg-[#E7313C] hover:bg-[#c92a34] text-white font-bold px-8 py-6 rounded-xl shadow-lg"
          >
            {isDownloading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
            {isDownloading ? "Generando..." : "Descargar PDF"}
          </Button>
        </div>

        <hr className="my-6 border-[#F2F2F2]" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Fecha de Creación</p>
              {/* Asegúrate que data.createdAt venga correcto desde el DTO */}
              <p className="text-sm font-semibold text-slate-700">
                {new Date(data.createdAt).toLocaleDateString('es-CL')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-slate-400" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Proveedores</p>
              <p className="text-sm font-semibold text-slate-700">
                {data.requestQuoteSuppliers?.length || 0} notificados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}