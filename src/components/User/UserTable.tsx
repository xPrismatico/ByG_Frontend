"use client";

import { Shield, User as UserIcon, ClipboardList, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// 1. IMPORTA LOS MODALES AQUÍ
import { EditUserDialog } from "./EditUserDialog";
import { ViewUserDialog } from "./ViewUserDialog"; 

// 2. ACTUALIZA LA INTERFAZ PARA RECIBIR EL ÚLTIMO ACCESO
export interface Usuario {
  id: number | string;
  nombre: string;
  email: string;
  rol: string;
  fecha: string;
  estado: string;
  ultimoAcceso?: string; 
}

interface UserTableProps {
  usuarios: Usuario[];
}

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

export function UserTable({ usuarios }: UserTableProps) {
  return (
    <Card className="border-gray-100 shadow-sm overflow-hidden w-full">
      <CardHeader className="border-b border-gray-50 pb-4">
        <CardTitle className="text-lg text-gray-800">Usuarios del Sistema</CardTitle>
        <CardDescription className="text-gray-500">
          {usuarios.length} usuarios encontrados
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="font-bold text-gray-700 text-sm">Nombre</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Email</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Rol</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Fecha Creación</TableHead>
              <TableHead className="font-bold text-gray-700 text-sm">Estado</TableHead>
              <TableHead className="text-right font-bold text-gray-700 text-sm"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <TableRow key={usuario.id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-gray-900">{usuario.nombre}</TableCell>
                  <TableCell className="text-gray-600">{usuario.email}</TableCell>
                  <TableCell>{renderRolBadge(usuario.rol)}</TableCell>
                  <TableCell className="text-gray-600">{usuario.fecha}</TableCell>
                  <TableCell>
                    {usuario.estado === "Activo" && (
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 gap-1.5 font-normal text-sm px-2.5 py-1">
                        <CheckCircle2 className="w-4 h-4" /> Activo
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      
                      {/* 3. REEMPLAZAMOS LOS BOTONES POR LOS MODALES */}
                      <ViewUserDialog usuario={usuario} />
                      <EditUserDialog usuario={usuario} />
                      
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                  No se encontraron usuarios que coincidan con los filtros.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}