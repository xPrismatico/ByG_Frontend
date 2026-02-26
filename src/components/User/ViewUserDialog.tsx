"use client";

import { useState } from "react";
import { Users, Shield, User as UserIcon, ClipboardList, XCircle, CheckCircle, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Importación de la interfaz compartida
import { Usuario } from "./UserTable";

interface ViewUserDialogProps {
  usuario: Usuario;
  onToggleStatus?: (email: string, currentStatus: boolean, role: string) => Promise<void>;
}

// Función para obtener los permisos según el rol
const getPermisosRol = (rawRol: string) => {
  const rol = rawRol?.trim().toLowerCase() || "";
  switch (rol) {
    case "admin":
    case "administrador":
      return [
        "Acceso completo a todas las funcionalidades",
        "Gestión de usuarios y asignación de roles",
        "Revisión y autorización de cotizaciones",
        "Gestión de compras y proveedores"
      ];
    case "autorizadorcompras":
    case "autorizador":
      return [
        "Revisión y autorización de cotizaciones",
        "Visualización de proveedores y compras",
        "Aprobación de presupuestos"
      ];
    case "gestorcompras":
    case "gestor":
      return [
        "Gestión de compras y proveedores",
        "Creación y seguimiento de cotizaciones",
        "Ingreso de facturas"
      ];
    default:
      return ["Acceso básico al sistema", "Visualización de perfil propio"];
  }
};

// Lógica visual de los badges de roles
const renderRolBadge = (rawRol: string) => {
  const rol = rawRol?.trim().toLowerCase() || "";
  switch (rol) {
    case "admin":
    case "administrador":
      return <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-100 gap-1.5 font-medium text-sm px-3 py-1 rounded-full"><Shield className="w-4 h-4" /> Administrador</Badge>;
    case "autorizadorcompras":
    case "autorizador":
      return <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-100 gap-1.5 font-medium text-sm px-3 py-1 rounded-full"><UserIcon className="w-4 h-4" /> Autorizador</Badge>;
    case "gestorcompras":
    case "gestor":
      return <Badge variant="outline" className="text-emerald-700 border-emerald-300 bg-emerald-100 gap-1.5 font-medium text-sm px-3 py-1 rounded-full"><ClipboardList className="w-4 h-4" /> Gestor</Badge>;
    default:
      return <Badge variant="outline" className="text-sm px-3 py-1 rounded-full bg-gray-50 text-gray-700">{rawRol}</Badge>;
  }
};

export function ViewUserDialog({ usuario, onToggleStatus }: ViewUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const permisos = getPermisosRol(usuario.rol);
  const isActivo = usuario.estado === "Activo";
  const esAdmin = usuario.rol?.toLowerCase().includes("admin");

  const handleToggle = async () => {
    if (!onToggleStatus) return;
    setLoading(true);
    try {
      await onToggleStatus(usuario.email, isActivo, usuario.rol);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-gray-600 border-gray-200 hover:bg-gray-50">
          <Eye className="w-4 h-4 mr-1.5" /> Ver
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white p-0 overflow-hidden shadow-2xl border-none">
        {/* CABECERA */}
        <div className="p-6 pb-4 border-b border-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
              <Users className="w-6 h-6 text-red-600" />
              {usuario.nombre}
              <Badge variant="outline" className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                isActivo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {usuario.estado}
              </Badge>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* CUERPO */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-base text-gray-900 font-semibold">{usuario.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Rol</p>
              <div>{renderRolBadge(usuario.rol)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Registro</p>
              <p className="text-base text-gray-900">{usuario.fecha}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Último Acceso</p>
              <p className="text-base text-gray-900">{usuario.ultimoAcceso || "Sin acceso"}</p>
            </div>
          </div>

          <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 shadow-sm">
            <h4 className="font-semibold text-blue-900 mb-3 text-sm">Permisos del Rol</h4>
            <ul className="space-y-2">
              {permisos.map((permiso, idx) => (
                <li key={idx} className="flex items-start text-blue-800/70 text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-500 shrink-0 mt-0.5" />
                  {permiso}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER - Solo muestra el botón si NO es administrador */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          {!esAdmin ? (
            <Button 
              onClick={handleToggle}
              disabled={loading}
              className={`w-full font-bold py-6 shadow-md transition-all ${
                isActivo 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {loading ? "Procesando..." : isActivo ? (
                <><XCircle className="w-4 h-4 mr-2" /> Desactivar Usuario</>
              ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Activar Usuario</>
              )}
            </Button>
          ) : (
            <p className="text-xs text-center w-full text-gray-400 italic">
              Los administradores no pueden ser desactivados por seguridad.
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}