// src/views/panel/PanelPage.tsx
"use client";

import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, ShoppingCart, FileText, Users, ArrowUpRight } from "lucide-react";

export default function PanelPage() {
  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Control</h1>
        <p className="text-muted-foreground">Resumen del Sistema de Gestión de Compras</p>
      </div>

      {/* Grid de Indicadores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Cotizaciones en Revisión" 
          value={2} 
          icon={ClipboardList} 
          colorClass="border-l-blue-500 text-blue-600" 
          linkText="Ver cotizaciones"
        />
        <SummaryCard 
          title="Compras Esperando Revisión" 
          value={2} 
          icon={ShoppingCart} 
          colorClass="border-l-yellow-500 text-yellow-600" 
          linkText="Ver compras"
        />
        <SummaryCard 
          title="Órdenes de Compra" 
          value={1} 
          icon={FileText} 
          colorClass="border-l-green-500 text-green-600" 
          linkText="Ver órdenes"
        />
        <SummaryCard 
          title="Proveedores Activos" 
          value={5} 
          icon={Users} 
          colorClass="border-l-red-500 text-red-600" 
          linkText="Ver proveedores"
        />
      </div>

      {/* Tabla de Solicitudes Recientes */}
      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Últimas Solicitudes de Compra</CardTitle>
          <p className="text-sm text-muted-foreground">Acceso rápido a las solicitudes de compra más recientes</p>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="font-bold">Nº Compra</TableHead>
                <TableHead className="font-bold">Fecha</TableHead>
                <TableHead className="font-bold">Solicitante</TableHead>
                <TableHead className="font-bold">Items</TableHead>
                <TableHead className="font-bold">Estado</TableHead>
                <TableHead className="text-right font-bold">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium">SC-2026-005</TableCell>
                <TableCell>25 feb 2026</TableCell>
                <TableCell>Diego Hidráulico (Terreno Planta Concepción)</TableCell>
                <TableCell>1 item</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none px-3 py-1">
                    <span className="mr-2 h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    Solicitud de cotización enviada
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="font-semibold text-gray-600">
                    Ver detalle <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}