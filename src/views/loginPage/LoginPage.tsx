"use client";

import Image from "next/image";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Servicios y Storage
import { AuthServices } from "@/services/AuthServices";
import { AuthStorage } from "@/services/AuthStorage";

// Componentes de shadcn/ui
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email({
    message: "Ingrese un correo electrónico válido.",
  }).min(1, {
    message: "Email es requerido.",
  }),
  password: z.string().min(1, {
    message: "Contraseña es requerida.",
  }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  // Estados para manejar errores de la API
  const [errors, setErrors] = useState<string | null>(null);
  const [errorBool, setErrorBool] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setErrorBool(false);
    setErrors(null);

    try {
      const response = await AuthServices.login(values);

      if (response.success) {
        //Usamos login() del contexto
        login(response.data); 
        
        router.push("/");
      }
    } catch (error: any) {
      setErrorBool(true);
      // Aseguramos que 'errors' sea un string para evitar el error de React Child
      setErrors(typeof error === 'string' ? error : (error.message || "Error al iniciar sesión"));
    }
  }; // <-- Verifica que esta llave cierre correctamente 'onSubmit'

  return (
    <main 
      className="relative flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat font-sans"
      style={{ backgroundImage: "url('/LoginFondo.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />

      <Card className="z-10 w-full max-w-md border-none bg-white/95 backdrop-blur-md shadow-2xl mx-4">
        <CardHeader className="flex flex-col items-center justify-center space-y-4 pb-2">
          <div className="relative w-24 h-24 overflow-hidden rounded-xl shadow-sm">
            <Image
              src="/logoByG.png"
              alt="Logo ByG Ingeniería"
              fill
              className="object-contain p-2"
              priority
            />
          </div>

          <div className="text-center space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
              ByG Ingeniería
            </CardTitle>
            <CardDescription className="text-base font-medium text-gray-500">
              Sistema de Gestión de Compras
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="usuario@byg.cl" 
                        {...field} 
                        className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Contraseña</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorBool && (
                <Alert variant="default" className="border-red-500 bg-red-100 text-red-900">
                    <AlertTitle className="flex items-center gap-2">
                        <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-5h2v2h-2v-2zm0-6h2v4h-2V7z" clipRule="evenodd" />
                        </svg>
                        ¡Error!
                    </AlertTitle>
                    <AlertDescription>{errors}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#E33439] hover:bg-[#c12a2f] text-white font-bold py-6 text-lg transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Cargando..." : "Iniciar Sesión"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}