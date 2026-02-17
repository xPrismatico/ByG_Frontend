import LoginPage  from "@/views/loginPage/LoginPage";

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Login() {
    console.log("Login page loaded");
    return <LoginPage />;
}