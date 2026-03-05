import RoleGuard from "@/components/RoleGuard";
import UserList from "@/views/userList/UserList";

export const metadata = {
  title: "Usuarios | Sistema de Compras ByG",
  description: "Gestión de usuarios del sistema de compras de ByG Ingeniería",
}

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Usuarios() {
    return (
    <RoleGuard allowedRoles={['Admin']}>
       <UserList />;
    </RoleGuard>
    )
    
}