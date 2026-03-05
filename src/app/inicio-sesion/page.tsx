import LoginPage  from "@/views/loginPage/LoginPage";

export const metadata = {
  title: "Iniciar Sesión | Sistema de Compras ByG",
  description: "Inicio de sesión en el sistema de compras de ByG Ingeniería",
}

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Login() {

    return <LoginPage />;
}