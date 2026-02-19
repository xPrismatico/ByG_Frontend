"use client";

import { useEffect, useState } from "react";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, ShoppingCart, FileText, Users, ArrowUpRight, Loader2 } from "lucide-react";

// Servicios e Interfaces
import { PurchaseServices } from "@/services/PurchaseServices";
import { PurchaseSummary } from "@/interfaces/purchase";

export default function PanelPage() {
  const [purchases, setPurchases] = useState<PurchaseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ quotes: 0, purchases: 0, orders: 0, suppliers: 5 });

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        // Ajustamos la llamada al servicio con el parámetro de página requerido
        const response = await PurchaseServices.getPurchases({ pageNumber: 1, pageSize: 10 });

        if (response.success && response.data) {
          // Si el backend devuelve PagedResponse, la data real está en response.data.data
          const dataList = Array.isArray(response.data) ? response.data : (response.data as any).data;
          
          setPurchases(dataList || []);
          
          // Cálculo dinámico para ByG Ingeniería
          setStats(prev => ({
            ...prev,
            purchases: dataList?.length || 0,
            quotes: dataList?.filter((p: PurchaseSummary) => 
                p.status.toLowerCase().includes("cotización")
            ).length || 0
          }));
        }
      } catch (error) {
        console.error("Error al cargar el panel:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Control</h1>
        <p className="text-muted-foreground">Resumen del Sistema de Gestión de Compras</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard 
          title="Cotizaciones en Revisión" 
          value={stats.quotes} 
          icon={ClipboardList} 
          colorClass="border-l-blue-500 text-blue-600" 
          linkText="Ver cotizaciones" 
          href="/cotizacion" 
        />
        <SummaryCard 
          title="Compras Esperando Revisión" 
          value={stats.purchases} 
          icon={ShoppingCart} 
          colorClass="border-l-yellow-500 text-yellow-600" 
          linkText="Ver compras" 
          href="/compra" 
        />
        <SummaryCard 
          title="Órdenes de Compra" 
          value={stats.orders} 
          icon={FileText} 
          colorClass="border-l-green-500 text-green-600" 
          linkText="Ver órdenes" 
          href="/orden-compra" 
        />
        <SummaryCard 
          title="Proveedores Activos" 
          value={stats.suppliers} 
          icon={Users} 
          colorClass="border-l-red-500 text-red-600" 
          linkText="Ver proveedores" 
          href="/proveedor" 
        />
      </div>

      <Card className="shadow-sm border-none">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Últimas Solicitudes de Compra</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Nº Compra</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.length > 0 ? (
                purchases.slice(0, 5).map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium">{p.purchaseNumber}</TableCell>
                    <TableCell>{new Date(p.requestDate).toLocaleDateString('es-CL')}</TableCell>
                    <TableCell className="max-w-[250px] truncate">{p.requester}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-none">
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="font-semibold text-gray-600">
                        Ver detalle <ArrowUpRight className="ml-1 h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={5} className="text-center py-10">No hay datos disponibles</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}