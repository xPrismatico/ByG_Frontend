"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UserFilters } from "@/interfaces/Users"; 

// Extendemos la interfaz localmente para incluir el 'role' que usaremos en el frontend
export interface ExtendedUserFilters extends UserFilters {
  role?: string;
}

interface Props {
  onFilterChange: (filters: ExtendedUserFilters) => void;
}

export default function UserFilter({ onFilterChange }: Props) {
  // Estados locales
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState("todos");
  const [status, setStatus] = useState("todos");

  // Función unificada para emitir los cambios al componente padre (UserList)
  const emitFilters = (newSearch: string, newRole: string, newStatus: string) => {
    const filtros: ExtendedUserFilters = {
      searchTerm: newSearch || undefined,
      pageNumber: 1,
      pageSize: 10,
    };

    // Mapeo del estado (string) a booleano para el backend (isActive)
    if (newStatus === "activo") filtros.isActive = true;
    if (newStatus === "inactivo") filtros.isActive = false;

    // Pasamos el rol para poder filtrarlo localmente en el frontend
    if (newRole !== "todos") filtros.role = newRole;

    onFilterChange(filtros);
  };

  // Handlers para cada input que actualizan su estado y emiten los filtros
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    emitFilters(val, role, status);
  };

  const handleRoleChange = (val: string) => {
    setRole(val);
    emitFilters(searchTerm, val, status);
  };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    emitFilters(searchTerm, role, val);
  };

  return (
    <Card className="border-gray-100 shadow-sm w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          
          {/* 1. Buscador */}
          <div className="space-y-2 w-full">
            <Label htmlFor="search" className="text-sm text-gray-600 font-medium">Buscar</Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="Nombre o email..."
                className="pl-9 bg-gray-50/50 border-gray-200 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          {/* 2. Filtro de Rol */}
          <div className="space-y-2 w-full">
            <Label className="text-sm text-gray-600 font-medium">Rol</Label>
            <Select value={role} onValueChange={handleRoleChange}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200 w-full">
                <SelectValue placeholder="Seleccionar rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los roles</SelectItem>
                {/* Estos valores coinciden exactamente con los roles de tu IdentitySeeder en C# */}
                <SelectItem value="Admin">Administrador</SelectItem>
                <SelectItem value="AutorizadorCompras">Autorizador</SelectItem>
                <SelectItem value="GestorCompras">Gestor</SelectItem>
                <SelectItem value="User">Usuario Básico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 3. Filtro de Estado */}
          <div className="space-y-2 w-full">
            <Label className="text-sm text-gray-600 font-medium">Estado</Label>
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200 w-full">
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="inactivo">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}