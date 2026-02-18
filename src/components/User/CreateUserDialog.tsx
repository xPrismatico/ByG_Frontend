"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, ShoppingBag, Shield, User } from "lucide-react";

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

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es requerido." }),
  email: z.string().email({ message: "Ingrese un correo válido." }),
  password: z.string().min(6, { message: "Mínimo 6 caracteres." }),
  confirmPassword: z.string().min(6, { message: "Mínimo 6 caracteres." }),
  rol: z.string().min(1, { message: "Selecciona un rol." }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
});

export function CreateUserDialog() {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { nombre: "", email: "", password: "", rol: "" },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Nuevo usuario:", values);
    setOpen(false); 
    form.reset();   
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* AQUÍ ESTÁ LA CLAVE: Un solo botón como disparador */}
      <DialogTrigger asChild>
        <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Nuevo Usuario</DialogTitle>
          <DialogDescription>Completa los datos del nuevo usuario</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            
            <FormField control={form.control} name="nombre" render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo *</FormLabel>
                <FormControl><Input placeholder="Juan Pérez García" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico *</FormLabel>
                <FormControl><Input placeholder="usuario@byg.cl" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="password" render={({ field }) => (
              <FormItem>
                <FormLabel>Contraseña *</FormLabel>
                <FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <FormField control={form.control} name="confirmPassword" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmar Contraseña *</FormLabel>
                <FormControl><Input type="password" placeholder="Mínimo 6 caracteres" {...field} /></FormControl>
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
                    <SelectItem value="AutorizadorCompras"><div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-500" /> Autorizador</div></SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )} />

            <DialogFooter className="gap-2 sm:gap-0 mt-4">
              <DialogClose asChild><Button type="button" variant="outline" className="border-gray-300">Cancelar</Button></DialogClose>
              <Button type="submit" className="bg-[#E33439] hover:bg-[#c12a2f] text-white font-bold">Crear Usuario</Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}