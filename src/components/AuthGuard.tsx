"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  // Estado local para controlar el "parpadeo" mientras decidimos si redirigir
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Solo ejecutamos la lógica cuando AuthContext ya cargó el usuario del localStorage
    if (!isLoading) {
      
      // CASO 1: Usuario NO logueado intenta entrar a ruta privada
      if (!user && pathname !== "/inicio-sesion") {
        router.push("/inicio-sesion");
      } 
      
      // CASO 2: Usuario SI logueado intenta entrar al login (NUEVO)
      else if (user && pathname === "/inicio-sesion") {
        router.push("/"); // Lo mandamos al Dashboard
      }
      
      // CASO 3: Acceso permitido (Usuario en Dashboard O Visitante en Login)
      else {
        setIsChecking(false);
      }
    }
  }, [user, isLoading, pathname, router]);

  // Mientras carga el AuthContext (isLoading) O mientras el Guard decide (isChecking)
  // mostramos el spinner para evitar que se vea el contenido protegido o el login momentáneamente.
  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return <>{children}</>;
}