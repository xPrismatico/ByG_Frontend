// src/app/proveedor/page.tsx
import RoleGuard from "@/components/RoleGuard"
import SuppliersPage from "@/views/SuppliersPage/SuppliersPage"

export const metadata = {
  title: "Proveedores | Sistema de Compras ByG",
  description: "Gestión de proveedores, categorías y contactos de ByG Ingeniería",
}

export default function Page() {
  return (
  // SOLO Admin y Gestor pueden ver esto
    <RoleGuard allowedRoles={["Admin", "GestorCompras"]}>
      
      <div className="p-6">
        <SuppliersPage />
      </div>

    </RoleGuard>
  )
}