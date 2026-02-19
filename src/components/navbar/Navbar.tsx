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
  LogIn
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// Todas las rutas del sistema habilitadas para desarrollo
const navItems = [
  { label: "Panel de Control", href: "/", icon: LayoutDashboard },
  { label: "Compras", href: "/compra", icon: ShoppingCart },
  { label: "Cotizaciones", href: "/cotizacion", icon: FileText },
  { label: "Órdenes de Compra", href: "/orden-compra", icon: ClipboardList },
  { label: "Proveedores", href: "/proveedor", icon: Building2 },
  { label: "Gestión de Usuarios", href: "/Usuarios", icon: UserCog },
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF] border-b border-[#F2F2F2] shadow-sm">
      <div className="w-full mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        
        {/* LADO IZQUIERDO: Espacio para tu Logo */}
        <Link href="/dashboard" className="flex items-center mr-6 shrink-0">
          <Image
            src="/logoByGLetras.png" // Recuerda cambiar esto por el nombre real de tu archivo en la carpeta public
            alt="ByG Ingeniería"
            width={140}
            height={48}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* CENTRO: Navegación Desktop (Todo visible) */}
        <nav className="hidden lg:flex items-center flex-1 overflow-x-auto gap-1 px-4">
          {navItems.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  active 
                    ? "bg-[#E7313C]/10 text-[#E7313C]" // Activo: Fondo rojizo suave, texto rojo
                    : "text-[#2F2F2F] hover:bg-[#F2F2F2] hover:text-[#1C1C1C]" // Inactivo: Gris oscuro
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-[#E7313C]" : "text-[#2F2F2F]")} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* LADO DERECHO: Botón de Login Desktop */}
        <div className="hidden lg:flex items-center shrink-0 pl-4 border-l border-[#F2F2F2]">
          <Button asChild className="bg-[#E7313C] text-white hover:bg-[#E7313C]/90 transition-colors shadow-none">
            <Link href="/InicioSesion">
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar sesión
            </Link>
          </Button>
        </div>

        {/* VISTA MÓVIL (Menú Hamburguesa) */}
        <div className="lg:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#1C1C1C]">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-white p-0 flex flex-col">
              <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
              
              <div className="p-4 border-b border-[#F2F2F2] flex justify-center">
                 <Image
                  src="/logoByGLetras.png"
                  alt="ByG Ingeniería"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              {/* Opciones de navegación móvil */}
              <div className="flex flex-col p-4 gap-2 flex-1 overflow-y-auto">
                {navItems.map((item) => {
                  const active = pathname === item.href
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        active 
                          ? "bg-[#E7313C]/10 text-[#E7313C]" 
                          : "text-[#2F2F2F] hover:bg-[#F2F2F2]"
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active ? "text-[#E7313C]" : "text-[#2F2F2F]")} />
                      {item.label}
                    </Link>
                  )
                })}
              </div>

              {/* Botón Login al fondo en móvil */}
              <div className="p-4 border-t border-[#F2F2F2]">
                <Button asChild className="w-full bg-[#E7313C] text-white hover:bg-[#E7313C]/90 shadow-none">
                  <Link href="/InicioSesion">
                    <LogIn className="h-5 w-5 mr-3" />
                    Iniciar sesión
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </header>
  )
}