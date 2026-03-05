"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle, Info, Send, Clock, FileCheck, Truck, AlertOctagon, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function DashboardHelpDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-slate-600 border-slate-300">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Guía de Estados</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl text-[#1C1C1C]">
            <Info className="h-5 w-5 text-blue-600" />
            Estados del Ciclo de Compras
          </DialogTitle>
          <DialogDescription>
            Definición de los estados por los que pasa una solicitud según el flujo de negocio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          
          {/* Fase 1: Inicio */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Fase 1: Solicitud
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
                <StatusItem 
                    badge="Esperando proveedores" 
                    color="bg-slate-100 text-slate-700 border-slate-200"
                    icon={<PackageSearch className="w-3 h-3"/>}
                    desc="Estado inicial. La compra se ha creado pero aún no se han seleccionado proveedores para cotizar."
                />
                 <StatusItem 
                    badge="Solicitud de cotización enviada" 
                    color="bg-blue-50 text-blue-700 border-blue-200"
                    icon={<Send className="w-3 h-3"/>}
                    desc="Se han enviado los correos a los proveedores. El sistema espera que lleguen las ofertas."
                />
            </div>
          </section>

          {/* Fase 2: Decisión */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Fase 2: Cotización
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
                <StatusItem 
                    badge="Esperando revisión" 
                    color="bg-amber-50 text-amber-700 border-amber-200"
                    icon={<Clock className="w-3 h-3"/>}
                    desc="El Gestor ha subido cotizaciones al sistema. El Autorizador debe revisar y aceptar/rechazar."
                />
                 <StatusItem 
                    badge="OC esperando aprobación" 
                    color="bg-orange-50 text-orange-700 border-orange-200"
                    icon={<FileCheck className="w-3 h-3"/>}
                    desc="Se aceptó una cotización y se generó la OC. Falta la aprobación final del Gestor/Admin para enviarla."
                />
            </div>
          </section>

          {/* Fase 3: Cierre */}
          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Fase 3: Ejecución
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
                <StatusItem 
                    badge="OC enviada" 
                    color="bg-emerald-50 text-emerald-700 border-emerald-200"
                    icon={<Truck className="w-3 h-3"/>}
                    desc="La Orden de Compra fue aprobada y enviada al proveedor. Proceso de compra cerrado."
                />
                 <StatusItem 
                    badge="Rechazada" 
                    color="bg-red-50 text-red-700 border-red-200"
                    icon={<AlertOctagon className="w-3 h-3"/>}
                    desc="La solicitud fue cancelada o rechazada en alguna etapa del flujo."
                />
            </div>
          </section>

        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatusItem({ badge, color, desc, icon }: { badge: string, color: string, desc: string, icon: any }) {
    return (
        <div className="p-3 border rounded-lg bg-white shadow-sm">
            <Badge variant="outline" className={`mb-2 ${color} gap-1.5`}>
                {icon} {badge}
            </Badge>
            <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
        </div>
    )
}