// src/app/compra/page.tsx

import RoleGuard from "@/components/RoleGuard"
import PurchasesPage from "@/views/PurchasePage/PurchasePage"

export const metadata = {
  title: "Compra | Sistema de Compras ByG",
  description: "Gestión de compras con sus respectivas solicitudes, cotizaciones y órdenes de compra de ByG Ingeniería",
}

export default function Page() {

  return (
// Aquí permitimos a los 3 roles principales
    <RoleGuard allowedRoles={["Admin", "GestorCompras", "AutorizadorCompras"]}>
      <PurchasesPage />
    </RoleGuard>
    )
  
}