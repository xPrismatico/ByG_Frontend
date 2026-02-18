"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { CreateUserDialog } from "@/components/User/CreateUserDialog"; 
import UserFilter from "@/components/User/UserFilters"; 
import { UserTable, Usuario } from "@/components/User/UserTable";
import { Skeleton } from "@/components/ui/skeleton";

import { UserDto, UserFilters } from "@/interfaces/Users"; 
import { UserServices } from "@/services/UserServices";

export default function UserList() {
  const [filters, setFilters] = useState<UserFilters>({});

  const {
    data: usuariosRaw,
    isLoading,
    isError,
    refetch
  } = useQuery<UserDto[]>({
    queryKey: ['usuarios', filters],
    queryFn: () => UserServices.fetchUsers(filters),
  });

  const handleToggleStatus = async (email: string, currentStatus: boolean) => {
    try {
      await UserServices.toggleStatus(email, !currentStatus);
      toast.success(`Usuario ${currentStatus ? 'desactivado' : 'activado'} correctamente`);
      refetch();
    } catch (error) {
      toast.error('Error al cambiar el estado del usuario');
    }
  };

  const usuariosFiltrados: Usuario[] = usuariosRaw
    ?.filter(user => {
      const r = (filters as any).role;
      if (r && r !== "todos") {
        return user.role === r;
      }
      return true;
    })
    .map((user, index) => ({
      id: user.email, 
      nombre: `${user.firstName} ${user.lastName}`,
      email: user.email,
      rol: user.role,
      fecha: user.registered,
      estado: user.isActive ? "Activo" : "Inactivo",
      ultimoAcceso: user.lastAccess || "Sin acceso"
    })) || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-6 py-10 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-bold text-red-600">Error al cargar usuarios</h1>
        <p className="text-gray-600">No se pudieron obtener los datos. Verifica tu conexión con el servidor.</p>
        <button onClick={() => refetch()} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 bg-gray-50/30 min-h-screen">
      
      {/* CABECERA (Con un solo botón) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra usuarios del sistema y sus roles de acceso</p>
        </div>
        
        {/* Aquí está el único botón de crear usuario */}
        <div className="flex-shrink-0">
          <CreateUserDialog />
        </div>
      </div>

      {/* CAJA DE INFORMACIÓN AZUL */}
      <div className="bg-[#f0f5fe] border border-blue-200 rounded-lg p-4 flex items-start gap-3 shadow-sm w-full">
        <Shield className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" />
        <div className="text-sm space-y-1.5 text-blue-900">
          <div><span className="font-semibold text-blue-800">Administrador: </span><span className="text-blue-700">Acceso completo al sistema.</span></div>
          <div className="pl-2"><span className="font-semibold text-blue-800">Autorizador: </span><span className="text-blue-700">Revisa y autoriza cotizaciones.</span></div>
          <div className="pl-2"><span className="font-semibold text-blue-800">Gestor: </span><span className="text-blue-700">Opera el proceso de compras.</span></div>
        </div>
      </div>

      {/* COMPONENTE DE FILTROS */}
      <UserFilter onFilterChange={setFilters} />

      {/* COMPONENTE DE LA TABLA */}
      <UserTable usuarios={usuariosFiltrados} />

    </div>
  );
}