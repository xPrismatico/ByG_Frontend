// src/app/orden-compra/[id]/page.tsx

import { Metadata } from "next";
import PurchaseOrderDetailPage from "@/views/PurchaseOrderDetailPage/PurchaseOrderDetailPage";

export const metadata: Metadata = {
  title: "Detalle Orden de Compra | Sistema de Compras ByG",
  description: "Visualización y descarga de órdenes de compra emitidas.",
};

interface Props {
    params: { id: string }
}

export default function Page({ params }: Props) {
  // Convertimos el id de string a number para pasarlo a la vista
  const orderId = parseInt(params.id);
  
  return <PurchaseOrderDetailPage orderId={orderId} />;
}