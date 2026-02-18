"use client";

import { useState } from "react";
import { Users, Shield, User as UserIcon, ClipboardList, Edit, XCircle, CheckCircle, Eye } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Usuario } from "./UserTable";
import { EditUserDialog } from "./EditUserDialog";
import { TableCell } from "../ui/table";

interface ViewUserDialogProps {
  usuario: Usuario;
}

// Reutilizamos la lógica visual de los roles
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
    case "user":
    case "usuario":
      return <Badge variant="outline" className="text-gray-700 border-gray-300 bg-gray-100 gap-1.5 font-medium text-sm px-3 py-1 rounded-full"><UserIcon className="w-4 h-4" /> Usuario</Badge>;
    default:
      return <Badge variant="outline" className="text-sm px-3 py-1 rounded-full bg-gray-50 text-gray-700">{rawRol}</Badge>;
  }
};

// Función para obtener los permisos en texto según el rol
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

export function ViewUserDialog({ usuario }: ViewUserDialogProps) {
  const [open, setOpen] = useState(false);
  const permisos = getPermisosRol(usuario.rol);
  const isActivo = usuario.estado === "Activo";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* Este es el botón "Ver" que aparecerá en la tabla */}
        <Button variant="outline" size="sm" className="h-8 text-gray-600 border-gray-200 hover:bg-gray-50">
          <Eye className="w-4 h-4 mr-1.5" /> Ver
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white p-0 overflow-hidden">
        {/* CABECERA DEL MODAL */}
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
            <p className="text-gray-500 pt-1 text-sm">
              Información completa del usuario
            </p>
          </DialogHeader>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="p-6 space-y-6">
          {/* Grid de información */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
              <p className="text-base text-gray-900 font-medium">{usuario.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Rol</p>
              <div>{renderRolBadge(usuario.rol)}</div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha de Creación</p>
              <p className="text-base text-gray-900">{usuario.fecha}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Último Acceso</p>
              <p className="text-base text-gray-900">{usuario.ultimoAcceso || "Sin acceso"}</p>
            </div>
          </div>

          {/* Caja de Permisos */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Permisos del Rol</h4>
            <ul className="space-y-2">
              {permisos.map((permiso, idx) => (
                <li key={idx} className="flex items-start text-gray-500 text-sm">
                  <span className="mr-2 text-gray-400 font-bold">·</span>
                  {permiso}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FOOTER DEL MODAL */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-center sm:justify-between">
          
          {isActivo ? (
            <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white w-full sm:w-auto flex-1">
              <XCircle className="w-4 h-4 mr-2" /> Desactivar
            </Button>
          ) : (
            <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto flex-1">
              <CheckCircle className="w-4 h-4 mr-2" /> Activar
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}