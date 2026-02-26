"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Shield } from "lucide-react";
import { UserServices } from "@/services/UserServices";
import { UserTable } from "@/components/User/UserTable";
import { CreateUserDialog } from "@/components/User/CreateUserDialog";
import UserFilter from "@/components/User/UserFilters";
import { PagedResponse } from "@/interfaces/PagedResponse";
import { UserDto, UserFilters } from "@/interfaces/Users";

export default function UserList() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [sort, setSort] = useState("registered:desc");
  const [page, setPage] = useState(1);

  const filters: UserFilters = {
    searchTerm: search,
    role: role, 
    isActive: isActive === "" ? undefined : isActive === "true",
    registeredFrom: start,
    registeredTo: end,
    orderBy: sort,
    pageNumber: page,
    pageSize: 10
  };

  const { data: pagedData, isLoading, refetch } = useQuery<PagedResponse<UserDto>>({
    queryKey: ['usuarios', filters],
    queryFn: () => UserServices.fetchUsers(filters),
  });

  const handleToggleStatus = async (email: string, currentStatus: boolean, userRole: string) => {
    if (userRole?.toLowerCase().includes("admin")) {
      toast.error("Acción denegada", { description: "No se puede desactivar a un administrador." });
      return;
    }
    try {
      await UserServices.toggleStatus(email);
      toast.success("Estado actualizado con éxito.");
      refetch();
    } catch (e) { 
      toast.error("Error al actualizar."); 
    }
  };

  const handleClear = () => {
    setSearch(""); setRole(""); setIsActive(""); setStart(""); setEnd(""); 
    setSort("registered:desc"); setPage(1);
  };

  const usuariosMapeados = pagedData?.items.map(u => ({
    id: u.email, 
    nombre: `${u.firstName || ''} ${u.lastName || ''}`.trim() || "Sin nombre", 
    email: u.email,
    rol: u.role, 
    fecha: u.registered, 
    estado: u.isActive ? "Activo" : "Inactivo", 
    ultimoAcceso: u.lastAccess || "N/A"
  })) || [];

  if (isLoading) return <div className="p-10 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administra los accesos de ByG Ingeniería</p>
        </div>
        <CreateUserDialog />
      </div>

      {/* Cuadro informativo de roles */}
      <div className="bg-[#f0f5fe] border border-blue-200 rounded-lg p-4 flex items-start gap-3 shadow-sm w-full">
        <Shield className="w-5 h-5 text-blue-700 mt-0.5 shrink-0" />
        <div className="text-sm space-y-1.5 text-blue-900">
          <div><span className="font-semibold text-blue-800">Administrador: </span>Acceso completo al sistema.</div>
          <div><span className="font-semibold text-blue-800">Autorizador: </span>Revisa y autoriza cotizaciones.</div>
          <div><span className="font-semibold text-blue-800">Gestor: </span>Opera el proceso de compras.</div>
        </div>
      </div>

      <UserFilter 
        searchTerm={search} role={role} isActive={isActive} startDate={start} endDate={end} orderBy={sort}
        onSearchChange={(v) => {setSearch(v); setPage(1);}} 
        onRoleChange={(v) => {setRole(v); setPage(1);}} 
        onStatusChange={(v) => {setIsActive(v); setPage(1);}}
        onStartDateChange={(v) => {setStart(v); setPage(1);}} 
        onEndDateChange={(v) => {setEnd(v); setPage(1);}} 
        onSortChange={setSort} 
        onClear={handleClear}
      />

      <UserTable usuarios={usuariosMapeados} onToggleStatus={handleToggleStatus} />
    </div>
  );
}