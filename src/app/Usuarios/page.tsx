import UserList from "@/views/userList/UserList";

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Usuarios() {
    console.log("Lista de usuarios loaded");
    return <UserList />;
}