"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { StatusTimeline } from "@/components/dashboard/StatusTimeline"; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, Send, Clock, FileCheck, Truck, ArrowUpRight, ShoppingCart 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Servicios
import { PurchaseServices } from "@/services/PurchaseServices";
import { PurchaseSummary } from "@/interfaces/purchase";
import { DashboardHelpDialog } from "@/components/dashboard/DashboardHelpDialog";

export default function PanelPage() {
  const router = useRouter();
  
  const [recentPurchases, setRecentPurchases] = useState<PurchaseSummary[]>([]);
  const [loadingTable, setLoadingTable] = useState(true);
  
  const [stats, setStats] = useState({
    waitingProviders: -1, 
    quoteSent: -1,        
    waitingReview: -1,    
    waitingApproval: -1,  
    ordersSent: -1,
    totalPurchases: -1, // ✅ AGREGADO DE VUELTA
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
            resWaitProv, 
            resQuoteSent, 
            resWaitReview, 
            resWaitApprov, 
            resOrdersSent,
            resTotalPurch // ✅ Recuperamos la respuesta del total
        ] = await Promise.all([
            PurchaseServices.getPurchases({ status: "Esperando proveedores", pageSize: 1, pageNumber: 1 }),
            PurchaseServices.getPurchases({ status: "Solicitud de cotización enviada", pageSize: 1, pageNumber: 1 }),
            PurchaseServices.getPurchases({ status: "Esperando revisión", pageSize: 1, pageNumber: 1 }),
            PurchaseServices.getPurchases({ status: "OC esperando aprobación", pageSize: 1, pageNumber: 1 }),
            PurchaseServices.getPurchases({ status: "OC enviada", pageSize: 1, pageNumber: 1 }),
            PurchaseServices.getPurchases({ pageSize: 1, pageNumber: 1 }) // ✅ Consulta para el total general
        ]);

        setStats({
            waitingProviders: resWaitProv.success ? resWaitProv.data!.totalItems : 0,
            quoteSent: resQuoteSent.success ? resQuoteSent.data!.totalItems : 0,
            waitingReview: resWaitReview.success ? resWaitReview.data!.totalItems : 0,
            waitingApproval: resWaitApprov.success ? resWaitApprov.data!.totalItems : 0,
            ordersSent: resOrdersSent.success ? resOrdersSent.data!.totalItems : 0,
            totalPurchases: resTotalPurch.success ? resTotalPurch.data!.totalItems : 0, // ✅ Asignamos el valor
        });

        const resRecent = await PurchaseServices.getPurchases({ 
            pageNumber: 1, 
            pageSize: 5, 
            sortBy: "date_desc"
        });

        if (resRecent.success && resRecent.data) {
            setRecentPurchases(resRecent.data.items || []);
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setLoadingTable(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigateToPurchase = (id: number) => {
    router.push(`/compra/${id}`);
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Esperando proveedores": return "bg-slate-100 text-slate-700 border-slate-200";
      case "Solicitud de cotización enviada": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Esperando revisión": return "bg-amber-50 text-amber-700 border-amber-200";
      case "OC esperando aprobación": return "bg-orange-50 text-orange-700 border-orange-200";
      case "OC enviada": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rechazada": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-4 bg-slate-50/50 min-h-screen animate-in fade-in duration-500">
      
      {/* Encabezado Compacto */}
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-xl font-bold text-[#1C1C1C]">Panel de Compras</h1>
           <p className="text-xs text-slate-500">Resumen operativo del sistema.</p>
        </div>
        <DashboardHelpDialog />
      </div>

      {/* GRID DE 6 CONTADORES (Compacto) */}
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        
        {/* 1 */}
        <SummaryCard 
          title="Esperando Proveedor" 
          subTitle="Asigna proveedores a la compra"
          value={stats.waitingProviders} 
          icon={Package} 
          colorClass="border-l-slate-400 text-slate-600" 
        />

        {/* 2 */}
        <SummaryCard 
          title="Cotización solicitada" 
          subTitle="Solicitud enviada"
          value={stats.quoteSent} 
          icon={Send} 
          colorClass="border-l-blue-500 text-blue-600" 
        />

        {/* 3 */}
        <SummaryCard 
          title="Esperando Revisión" 
          subTitle="Ofertas recibidas"
          value={stats.waitingReview} 
          icon={Clock} 
          colorClass="border-l-amber-500 text-amber-600" 
        />

        {/* 4 */}
        <SummaryCard 
          title="Orden por aprobar" 
          subTitle="OC creada"
          value={stats.waitingApproval} 
          icon={FileCheck} 
          colorClass="border-l-orange-500 text-orange-600" 
        />

        {/* 5 */}
        <SummaryCard 
          title="Orden enviada" 
          subTitle="OC aprobada"
          value={stats.ordersSent} 
          icon={Truck} 
          colorClass="border-l-emerald-500 text-emerald-600" 
        />
        
        {/* 6 ✅ REGRESÓ EL TOTAL */}
        <SummaryCard 
          title="Compras" 
          subTitle="Histórico de compras"
          value={stats.totalPurchases} 
          icon={ShoppingCart} 
          colorClass="border-l-indigo-500 text-indigo-600" 
          // Link opcional si quieres que este sea el botón "Ver Todo"
          linkText="Ver todas"
          href="/compra"
        />

      </div>

      {/* LÍNEA DE TIEMPO VISUAL */}
      <StatusTimeline />

      {/* Tabla Reciente */}
      <Card className="shadow-sm border border-slate-200 overflow-hidden bg-white mt-4">
        <CardHeader className="border-b border-slate-100 py-3 px-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800">Actividad Reciente</CardTitle>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50" onClick={() => router.push('/compra')}>
                Ver historial completo <ArrowUpRight className="ml-1 h-3 w-3"/>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow className="hover:bg-transparent">
                <TableHead className="py-2 h-9 font-semibold text-slate-600 text-[11px] uppercase w-[100px]">Folio</TableHead>
                <TableHead className="py-2 h-9 font-semibold text-slate-600 text-[11px] uppercase">Proyecto</TableHead>
                <TableHead className="py-2 h-9 font-semibold text-slate-600 text-[11px] uppercase">Solicitante</TableHead>
                <TableHead className="py-2 h-9 font-semibold text-slate-600 text-[11px] uppercase">Estado</TableHead>
                <TableHead className="py-2 h-9 text-right font-semibold text-slate-600 text-[11px] uppercase w-[80px]">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadingTable ? (
                 Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell colSpan={5} className="p-2">
                            <div className="h-5 bg-slate-100 animate-pulse rounded"></div>
                        </TableCell>
                    </TableRow>
                 ))
              ) : recentPurchases.length > 0 ? (
                recentPurchases.map((p) => (
                  <TableRow 
                    key={p.id} 
                    className="hover:bg-slate-50 transition-colors cursor-pointer group border-b last:border-0"
                    onClick={() => handleNavigateToPurchase(p.id)}
                  >
                    <TableCell className="font-mono font-medium text-slate-700 text-xs py-2.5">
                        {p.purchaseNumber}
                    </TableCell>
                    <TableCell className="text-slate-600 text-xs py-2.5 font-medium">
                        {p.projectName}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs py-2.5">
                        {p.requester}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <Badge className={cn("border font-medium shadow-none text-[10px] px-1.5 py-0", getStatusBadgeStyle(p.status))}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors ml-auto" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-20 text-center text-slate-400 text-xs">
                        Sin actividad reciente.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}