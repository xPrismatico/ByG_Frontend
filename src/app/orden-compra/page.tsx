// src/app/orden-compra/page.tsx

import { Metadata } from "next";
import PurchaseOrderPage from "@/views/PurchaseOrderPage/PurchaseOrderPage";

export const metadata: Metadata = {
  title: "Órdenes de Compra | Sistema de Compras ByG",
  description: "Gestión y seguimiento de órdenes de compra emitidas a proveedores.",
};

export default function Page() {
  return <PurchaseOrderPage />;
}