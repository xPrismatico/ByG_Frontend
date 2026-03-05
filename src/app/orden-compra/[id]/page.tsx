import RoleGuard from "@/components/RoleGuard";
import PurchaseOrderDetailPage from "@/views/PurchaseOrderDetailPage/PurchaseOrderDetailPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle Orden de Compra | Sistema de Compras ByG",
  description: "Visualización y descarga de órdenes de compra emitidas.",
};

interface Props {
    params: Promise<{ id: string }> // Cambio clave: params es una Promesa
}


export default async function Page({ params }: Props) {
  // Esperamos a que se resuelva la promesa
  const resolvedParams = await params;
  
  // Ahora sí podemos acceder al id de forma segura
  const orderId = parseInt(resolvedParams.id);
  
  // Validación extra por seguridad (opcional pero recomendada)
  if (isNaN(orderId)) {
      return <div>Error: ID de orden inválido</div>;
  }
  
  return (
  
  <RoleGuard allowedRoles={["Admin", "GestorCompras", "AutorizadorCompras"]}>
    <PurchaseOrderDetailPage orderId={orderId} />;

  </RoleGuard>
  )
  
}