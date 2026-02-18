import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Importa el Provider que acabas de crear (ajusta la ruta según dónde lo guardaste)
import Providers from "@/components/Providers"; 
import { Navbar } from '../components/navbar/Navbar';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ByG Ingeniería",
  description: "Sistema de Gestión de Compras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        
        {/* 2. Envuelve {children} con el Provider */}
        <Providers>
          <Navbar />
          {children}
        </Providers>

      </body>
    </html>
  );
}