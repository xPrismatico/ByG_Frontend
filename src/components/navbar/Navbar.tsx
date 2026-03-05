"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  ShoppingCart, 
  FileText, 
  ClipboardList, 
  Building2, 
  UserCog, 
  Menu,
  LogIn,
  LogOut,
  User as UserIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext" // <--- IMPORTANTE

// 1. DEFINICIÓN DE ROLES EXACTOS (Deben coincidir con IdentitySeeder.cs)
// Admin, GestorCompras, AutorizadorCompras

const navItems = [
  { 
    label: "Panel de Control", 
    href: "/", 
    icon: LayoutDashboard, 
    // Todos pueden ver el dashboard
    roles: ["Admin", "GestorCompras", "AutorizadorCompras"] 
  },
  { 
    label: "Compras", 
    href: "/compra", 
    icon: ShoppingCart, 
    // El Autorizador debe ver la Compra para entender el contexto (quién pidió, para qué proyecto)
    roles: ["Admin", "GestorCompras", "AutorizadorCompras"] 
  },
  { 
    label: "Cotizaciones", 
    href: "/cotizacion", 
    icon: FileText, 
    // CRÍTICO: El Autorizador necesita esto para dar el "Visto Bueno"
    roles: ["Admin", "GestorCompras", "AutorizadorCompras"] 
  },
  { 
    label: "Órdenes de Compra", 
    href: "/orden-compra", 
    icon: ClipboardList, 
    // El Gestor las envía, el Autorizador las genera indirectamente, el Admin supervisa
    roles: ["Admin", "GestorCompras", "AutorizadorCompras"] 
  },
  { 
    label: "Proveedores", 
    href: "/proveedor", 
    icon: Building2, 
    // El Autorizador no suele dar de alta empresas, solo valida precios.
    // Se lo dejamos al Gestor (operativo) y Admin.
    roles: ["Admin", "GestorCompras"] 
  },
  { 
    label: "Gestión de Usuarios", 
    href: "/usuario", 
    icon: UserCog, 
    // Exclusivo Admin
    roles: ["Admin"] 
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth() // <--- Estado global

  // Filtramos items: Si no hay usuario, lista vacía. Si hay, filtra por rol.
  const authorizedNavItems = user 
    ? navItems.filter(item => item.roles.includes(user.role))
    : []

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#F2F2F2] shadow-sm">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* LOGO */}
        <Link href={user ? "/" : "/inicio-sesion"} className="flex items-center mr-6 shrink-0">
          <Image
            src="/logoByGLetras.png"
            alt="ByG Ingeniería"
            width={140}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* MENÚ DESKTOP */}
        {!isLoading && user && (
          <nav className="hidden lg:flex items-center flex-1 overflow-x-auto gap-1 px-4">
            {authorizedNavItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                    active 
                      ? "bg-[#E7313C]/10 text-[#E7313C]" 
                      : "text-[#2F2F2F] hover:bg-[#F2F2F2] hover:text-[#1C1C1C]"
                  )}
                >
                  <Icon className={cn("h-4 w-4", active ? "text-[#E7313C]" : "text-[#2F2F2F]")} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        )}

        {/* LADO DERECHO (Usuario / Login) */}
        <div className="hidden lg:flex items-center shrink-0 pl-4 border-l border-[#F2F2F2] gap-4">
          {!isLoading && (
            user ? (
              // ESTADO: LOGUEADO
              <>
                <div className="flex flex-col items-end mr-2 leading-tight">
                  <span className="text-sm font-bold text-[#1C1C1C]">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#E7313C] bg-[#E7313C]/10 px-2 py-0.5 rounded-full mt-1">
                    {user.role}
                  </span>
                </div>
                <Button 
                  onClick={logout} 
                  variant="outline"
                  size="sm"
                  className="border-[#E7313C] text-[#E7313C] hover:bg-[#E7313C] hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              // ESTADO: NO LOGUEADO
              <Button asChild className="bg-[#E7313C] text-white hover:bg-[#E7313C]/90 shadow-none">
                <Link href="/inicio-sesion">
                  <LogIn className="h-4 w-4 mr-2" />
                  Iniciar sesión
                </Link>
              </Button>
            )
          )}
        </div>

        {/* VISTA MÓVIL */}
        <div className="lg:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#1C1C1C]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-white p-0 flex flex-col">
              <SheetTitle className="sr-only">Menú</SheetTitle>
              
              {/* Cabecera Móvil */}
              <div className="p-6 border-b border-[#F2F2F2] bg-slate-50">
                 {user ? (
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="h-10 w-10 rounded-full bg-[#E7313C]/10 flex items-center justify-center text-[#E7313C]">
                          <UserIcon className="h-6 w-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-[#1C1C1C]">{user.firstName}</span>
                            <span className="text-xs text-gray-500">{user.lastName}</span>
                        </div>
                      </div>
                      <span className="text-xs text-center font-bold uppercase text-white bg-[#E7313C] py-1 px-2 rounded-md self-start">
                        {user.role}
                      </span>
                   </div>
                 ) : (
                   <div className="flex justify-center">
                      <Image src="/logoByGLetras.png" alt="Logo" width={120} height={40} className="object-contain" />
                   </div>
                 )}
              </div>
              
              {/* Links Móvil */}
              <div className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
                {user && authorizedNavItems.map((item) => {
                  const Icon = item.icon
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        active ? "bg-[#E7313C]/10 text-[#E7313C]" : "text-[#2F2F2F] hover:bg-[#F2F2F2]"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Botón Footer Móvil */}
              <div className="p-4 border-t border-[#F2F2F2]">
                {user ? (
                   <Button onClick={logout} variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <LogOut className="h-5 w-5 mr-3" />
                      Cerrar Sesión
                   </Button>
                ) : (
                   <Button asChild className="w-full bg-[#E7313C] text-white hover:bg-[#E7313C]/90">
                      <Link href="/inicio-sesion">
                        <LogIn className="h-5 w-5 mr-3" />
                        Iniciar sesión
                      </Link>
                   </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}