"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard"; // <--- Importar el Guard

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {/* El AuthGuard protege a todos los hijos (Navbar y Pages) */}
        <AuthGuard>
            {children}
        </AuthGuard>
      </AuthProvider>
    </QueryClientProvider>
  );
}