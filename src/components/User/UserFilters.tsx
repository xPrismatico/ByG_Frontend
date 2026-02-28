"use client";

import { Search, FilterX, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  searchTerm: string;
  role: string;
  isActive: string;
  startDate: string;
  endDate: string;
  orderBy: string;
  onSearchChange: (val: string) => void;
  onRoleChange: (val: string) => void;
  onStatusChange: (val: string) => void;
  onStartDateChange: (val: string) => void;
  onEndDateChange: (val: string) => void;
  onSortChange: (val: string) => void;
  onClear: () => void;
}

export default function UserFilter({
  searchTerm, role, isActive, onSearchChange, onRoleChange, onStatusChange
}: Props) {
  
  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        {/* Buscador */}
        <div className="flex-1 min-w-[240px] space-y-1.5">
          <Label className="text-xs font-bold text-gray-500 uppercase">Buscar Usuario</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              value={searchTerm}
              placeholder="Nombre o email..."
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-gray-50 border-none rounded-xl text-sm focus-visible:ring-red-500"
            />
          </div>
        </div>

        {/* Rol - Asegúrate de que los 'value' coincidan con el Backend */}
        <div className="w-full sm:w-64 space-y-1.5">
          <Label className="text-xs font-bold text-gray-500 uppercase">Filtrar por Rol</Label>
          <Select 
            value={role || "all"} 
            onValueChange={(val) => onRoleChange(val === "all" ? "" : val)}
          >
            <SelectTrigger className="bg-gray-50 border-none rounded-xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder="Todos los roles" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="Admin">Administrador</SelectItem>
              <SelectItem value="AutorizadorCompras">Autorizador de Compras</SelectItem>
              <SelectItem value="GestorCompras">Gestor de Compras</SelectItem>
              <SelectItem value="User">Usuario Estándar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        
        {/* Estado */}
        <div className="w-full sm:w-48 space-y-1.5">
          <Label className="text-xs font-semibold text-gray-700">Estado</Label>
          <Select value={isActive || "all"} onValueChange={(val) => onStatusChange(val === "all" ? "" : val)}>
            <SelectTrigger className="bg-gray-50 border-none rounded-xl">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="true">Activos</SelectItem>
              <SelectItem value="false">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}