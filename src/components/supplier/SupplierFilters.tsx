"use client"
import { Search, FilterX } from "lucide-react"

interface Props {
  search: string;
  isActive: string;
  category: string;
  startDate: string;
  endDate: string;
  sortBy: string;
  onSearchChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onClear: () => void;
}

export default function SupplierFilters({
  search, isActive, category, startDate, endDate, sortBy,
  onSearchChange, onStatusChange, onCategoryChange, onStartDateChange, onEndDateChange, onSortChange, onClear
}: Props) {
  
  // Fecha límite hoy para no filtrar futuros inexistentes
  const today = new Date().toISOString().split("T")[0];

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && endDate && val > endDate) onEndDateChange(val); // Auto-corrección
    onStartDateChange(val);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val && startDate && val < startDate) onStartDateChange(val); // Auto-corrección
    onEndDateChange(val);
  };

  return (
    <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#F2F2F2] shadow-sm flex flex-col gap-4">
      <div className="flex flex-wrap items-end gap-4">
        
        {/* Búsqueda Global */}
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Buscar Empresa</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              value={search}
              placeholder="RUT, Razón Social o Email..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
            />
          </div>
        </div>

        {/* Estado */}
        <div className="w-full sm:w-40 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Estado</label>
          <select 
            value={isActive}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none cursor-pointer"
          >
            <option value="">Todos</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        {/* Categoría */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Categoría</label>
          <input 
            type="text"
            value={category}
            placeholder="Ej: Ferretería..."
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
          />
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
            <option value="date_asc">Más antiguos primero</option>
            <option value="name_asc">Razón Social (A-Z)</option>
            <option value="name_desc">Razón Social (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* Fecha Inicio */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Registrado desde</label>
          <input 
            type="date"
            value={startDate}
            max={endDate || today}
            onChange={handleStartDateChange}
            className="w-full px-3 py-2 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-sm transition-colors outline-none"
          />
        </div>

        {/* Fecha Fin */}
        <div className="w-full sm:w-48 space-y-1.5">
          <label className="text-xs font-semibold text-[#2F2F2F]">Registrado hasta</label>
          <input 
            type="date"
            value={endDate}
            min={startDate}
            max={today}
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