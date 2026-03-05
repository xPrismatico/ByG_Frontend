import RoleGuard from "@/components/RoleGuard";
import PurchaseDetailsPage from "@/views/PurchaseDetailsPage/PurchaseDetailsPage"

interface Props {
  params: Promise<{ id: string }> // Cambiamos el tipo a Promise
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params; // Debemos esperar la promesa
  return {
    title: `Detalle de Compra #${id} | Sistema de Compras ByG`,
  };
}

export default async function Page({ params }: Props) {
  // Esperamos la promesa de params antes de usar id
  const { id } = await params;
  
  // Convertimos el ID a número de forma segura
  const purchaseId = parseInt(id, 10);

  if (isNaN(purchaseId)) {
    return <div className="p-6 text-red-600 font-bold">ID de compra inválido.</div>;
  }

  return (
  <RoleGuard allowedRoles={["Admin", "GestorCompras", "AutorizadorCompras"]}>

    <PurchaseDetailsPage purchaseId={purchaseId} />;

  </RoleGuard>
  )

}