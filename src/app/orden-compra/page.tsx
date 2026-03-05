// src/app/orden-compra/page.tsx

import { Metadata } from "next";
import PurchaseOrderPage from "@/views/PurchaseOrderPage/PurchaseOrderPage";
import RoleGuard from "@/components/RoleGuard";

export const metadata: Metadata = {
  title: "Órdenes de Compra | Sistema de Compras ByG",
  description: "Gestión y seguimiento de órdenes de compra emitidas a proveedores.",
};

export default function Page() {
  return (
  
  <RoleGuard allowedRoles={["Admin", "GestorCompras", "AutorizadorCompras"]}>
    <PurchaseOrderPage />;
  </RoleGuard>
  )
}