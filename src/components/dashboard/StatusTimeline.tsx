"use client";

import { Package, Send, Clock, FileCheck, Truck } from "lucide-react";

export function StatusTimeline() {
  const steps = [
    { icon: Package, label: "Recibida", sub: "Asigna proveedor" },
    { icon: Send, label: "Cotización", sub: "Solicitada" },
    { icon: Clock, label: "Revisión", sub: "Ofertas subidas" },
    { icon: FileCheck, label: "Aprobación", sub: "Orden esperando" },
    { icon: Truck, label: "Despacho", sub: "Orden enviada" },
  ];

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl py-4 px-6 shadow-sm">
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Flujo de Compra</h3>
      
      <div className="relative flex items-center justify-between">
        {/* Línea conectora */}
        <div className="absolute top-[12px] left-6 right-6 h-[2px] bg-slate-100 -z-0" />
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative z-10 flex flex-col items-center gap-2 group cursor-default">
            {/* Círculo Icono */}
            <div className="h-6 w-6 rounded-full bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center transition-all duration-300 group-hover:border-blue-500 group-hover:text-blue-600 group-hover:scale-110 shadow-sm">
              <step.icon className="h-3 w-3" />
            </div>
            
            {/* Textos */}
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-600 uppercase group-hover:text-blue-700 transition-colors">
                {step.label}
              </p>
              <p className="text-[9px] text-slate-400 font-medium whitespace-nowrap">
                {step.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}