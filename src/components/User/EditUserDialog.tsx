"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Edit, ShoppingBag, Shield, User as UserIcon } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Usuario } from "./UserTable"; // Importamos la interfaz desde la tabla

// Esquema de validación para edición
const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Ingrese un correo válido." }),
  password: z.string().optional(), // Es opcional porque puede quedar vacío
  rol: z.string().min(1, { message: "Selecciona un rol." }),
});

interface EditUserDialogProps {
  usuario: Usuario; // Recibe los datos del usuario a editar
}

export function EditUserDialog({ usuario }: EditUserDialogProps) {
   const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: usuario.nombre,
      email: usuario.email,
      password: "", // Siempre inicia vacío por seguridad
      rol: usuario.rol,
    },
  });

  // Si el modal se abre, reseteamos el formulario con los datos más frescos del usuario
  useEffect(() => {
    if (open) {
      form.reset({
        nombre: usuario.nombre,
        email: usuario.email,
        password: "",
        rol: usuario.rol,
      });
    }
  }, [open, usuario, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Guardando cambios para:", usuario.email, values);
    // Aquí a futuro conectarás con tu backend (ej. UserServices.updateUser)
    
    // Si la contraseña viene vacía, no se envía al backend
    const payload = { ...values };
    if (!payload.password) {
      delete payload.password;
    }
    
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* El botón que reemplazará al antiguo botón de "Editar" en la tabla */}
        <Button variant="outline" size="sm" className="h-8 text-gray-600 border-gray-200 hover:bg-gray-50">
          <Edit className="w-4 h-4 mr-1.5" /> Editar
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Editar Usuario</DialogTitle>
          <DialogDescription>Modifica la información del usuario</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico *</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña (dejar vacío para mantener actual)</FormLabel>
                <FormControl><Input type="password" placeholder="........" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="rol" render={({ field }) => (
              <FormItem>
                <FormLabel>Rol *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger><SelectValue placeholder="Seleccionar rol" /></SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GestorCompras"><div className="flex items-center gap-2"><ShoppingBag className="w-4 h-4 text-gray-500" /> Gestor de Compras</div></SelectItem>
                    <SelectItem value="Admin"><div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" /> Administrador</div></SelectItem>
                    <SelectItem value="AutorizadorCompras"><div className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-gray-500" /> Autorizador</div></SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <DialogClose asChild><Button type="button" variant="outline" className="border-gray-300">Cancelar</Button></DialogClose>
              <Button type="submit" className="bg-[#E33439] hover:bg-[#c12a2f] text-white font-bold">Guardar Cambios</Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}