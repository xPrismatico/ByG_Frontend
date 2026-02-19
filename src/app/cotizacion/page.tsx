import QuoteList from "@/views/quoteList/QuoteList";

// Consulta si usuario se encuentra autenticado o redirige a otra página
export default function Cotizaciones() {
    console.log("Lista de cotizaciones loaded");
    return <QuoteList />;
}