"use client"
import { Search, FilterX } from "lucide-react"

interface Props {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onClear: () => void;
}

export default function PurchaseFilters({
  search, status, startDate, endDate, sortBy,
  onSearchChange, onStatusChange, onStartDateChange, onEndDateChange, onSortChange, onClear
}: Props) {
  
  // Obtenemos la fecha de hoy en formato YYYY-MM-DD para limitar el calendario
  const today = new Date().toISOString().split("T")[0];

  // Manejador inteligente para la Fecha de Inicio
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Si la nueva fecha de inicio es MAYOR a la fecha de fin actual, auto-corregimos la fecha fin
    if (val && endDate && val > endDate) {
      onEndDateChange(val);
    }
    onStartDateChange(val);
  };

  // Manejador inteligente para la Fecha de Fin
  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Si la nueva fecha de fin es MENOR a la fecha de inicio actual, auto-corregimos la fecha inicio
    if (val && startDate && val < startDate) {
      onStartDateChange(val);
    }
    onEndDateChange(val);
  };

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#F2F2F2] shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        
        {/* Búsqueda Global */}
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={search}
              placeholder="N° de compra, proyecto o solicitante..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Estado */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Estado</label>
          <select 
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="Solicitud recibida">Solicitud recibida</option>
            <option value="Solicitud de cotización enviada">Solicitud de cotización enviada</option>
            <option value="Esperando revisión">Esperando revisión</option>
            <option value="OC esperando aprobación">OC esperando aprobación</option>
            <option value="OC enviada">OC enviada</option>
            <option value="Rechazada">Rechazada</option>
          </select>
        </div>

        {/* Ordenar Por */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Ordenar por</label>
          <select 
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none cursor-pointer"
          >
            <option value="date_desc">Más recientes primero</option>
            <option value="date_asc">Más antiguas primero</option>
            <option value="project_asc">Proyecto (A-Z)</option>
            <option value="project_desc">Proyecto (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* Fecha Inicio */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Desde fecha</label>
          <input 
            type="date"
            value={startDate}
            max={endDate || today} // No puede ser mayor a la fecha fin, ni mayor a hoy
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
          />
        </div>

        {/* Fecha Fin */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Hasta fecha</label>
          <input 
            type="date"
            value={endDate}
            min={startDate} // No puede ser menor a la fecha inicio
            max={today}     // No puede ser mayor a hoy
            onChange={handleEndDateChange}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
          />
        </div>

        {/* Botón Limpiar */}
        <button 
          onClick={onClear}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors ml-auto sm:ml-0"
          title="Limpiar todos los filtros"
        >
          <FilterX className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}