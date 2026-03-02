"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthStorage } from "@/services/AuthStorage";
import { UserSession, AuthenticatedUserDto } from "@/interfaces/Auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserSession | null;
  isLoading: boolean;
  login: (data: AuthenticatedUserDto) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Al cargar la app, revisamos si hay algo en localStorage
    const storedUser = AuthStorage.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = (data: AuthenticatedUserDto) => {
    // 1. Guardar en LocalStorage
    AuthStorage.saveSession(data);
    // 2. Actualizar estado global (React se entera y actualiza el Navbar)
    setUser({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role
    });
  };

  const logout = () => {
    AuthStorage.clearSession();
    setUser(null);
    router.push("/inicio-sesion");
    router.refresh();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}