import RoleGuard from "@/components/RoleGuard";
import QuoteList from "@/views/quoteList/QuoteList";

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Cotizaciones() {


    return (
    <RoleGuard allowedRoles={["Admin", "GestorCompras", "AutorizadorCompras"]}>
        <QuoteList />;
    </RoleGuard>
    )
}