"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, FileText, Calendar, DollarSign, Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger, DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { QuoteServices } from "@/services/QuoteServices";
import { CreateQuoteDto } from "@/interfaces/Quote";

// 1. Esquema con validación para arreglo de objetos (Tratados como string para evitar errores)
const formSchema = z.object({
  number: z.string().min(3, { message: "Requerido (ej: COT-001)." }),
  date: z.string().min(1, { message: "La fecha es requerida." }),
  items: z.array(z.object({
    name: z.string().min(1, { message: "Requerido." }),
    // Usamos string y validamos convirtiendo a número internamente
    quantity: z.string().refine((val) => Number(val) >= 1, { message: "Mín. 1" }),
    unitPrice: z.string().refine((val) => Number(val) >= 0, { message: "No válido." })
  })).min(1, { message: "Debes agregar al menos un ítem." })
});

export function CreateQuoteDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      number: "", 
      date: new Date().toISOString().split('T')[0], 
      // Iniciamos con strings vacíos o "1" en vez de números puros
      items: [{ name: "", quantity: "1", unitPrice: "0" }] 
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control as any,
    name: "items"
  });

  // Calculamos el total convirtiendo los strings a números en vivo
  const watchedItems = form.watch("items");
  const totalPrice = watchedItems.reduce((acc, curr) => {
    return acc + (Number(curr.quantity) * Number(curr.unitPrice));
  }, 0);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const payload: CreateQuoteDto = {
        number: values.number,
        status: "Pendiente",
        date: values.date,
        totalPrice: totalPrice, // El total que ya calculamos
        // Transformamos el array para que tu backend reciba números reales
        quoteItems: values.items.map(item => ({
          name: item.name,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      await QuoteServices.createQuote(payload);
      toast.success("Cotización registrada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      
      setOpen(false); 
      form.reset();   
    } catch (error) {
      toast.error("Ocurrió un error al registrar la cotización.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#E33439] hover:bg-[#c12a2f] text-white">
            <Plus className="w-4 h-4 mr-2" /> Nueva Cotización
        </Button>
        </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Registrar Cotización</DialogTitle>
          <DialogDescription>Añade los productos con sus respectivos precios.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control as any} name="number" render={({ field }) => (
                <FormItem>
                  <FormLabel>N° de Cotización *</FormLabel>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <FormControl><Input className="pl-9" placeholder="Ej: COT-2026-005" {...field} /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control as any} name="date" render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Recepción *</FormLabel>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <FormControl><Input type="date" className="pl-9" {...field} /></FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <FormLabel className="text-base font-semibold text-gray-800">Detalle de Productos</FormLabel>
              </div>
              
              <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-500 uppercase px-1">
                <div className="col-span-5">Producto / Descripción</div>
                <div className="col-span-2 text-center">Cant.</div>
                <div className="col-span-3 text-right">Precio Unitario</div>
                <div className="col-span-2"></div>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
                  
                  <div className="col-span-5">
                    <FormField control={form.control as any} name={`items.${index}.name`} render={({ field }) => (
                      <FormItem><FormControl><Input placeholder="Ej: Cable 10mm" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>

                  <div className="col-span-2">
                    <FormField control={form.control as any} name={`items.${index}.quantity`} render={({ field }) => (
                      <FormItem><FormControl><Input type="number" min="1" className="text-center" {...field} /></FormControl><FormMessage/></FormItem>
                    )} />
                  </div>

                  <div className="col-span-3">
                    <FormField control={form.control as any} name={`items.${index}.unitPrice`} render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                            <Input type="number" min="0" className="pl-6 text-right" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage/>
                      </FormItem>
                    )} />
                  </div>

                  <div className="col-span-2 flex justify-end">
                    <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => remove(index)} disabled={fields.length === 1}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button type="button" variant="outline" size="sm" className="w-full mt-2 border-dashed border-2 text-gray-600"
                onClick={() => append({ name: "", quantity: "1", unitPrice: "0" })}>
                <PlusCircle className="h-4 w-4 mr-2" /> Agregar otro producto
              </Button>
            </div>

            <div className="flex justify-end pt-2">
              <div className="bg-blue-50 text-blue-900 px-6 py-3 rounded-lg border border-blue-100 flex items-center gap-4">
                <span className="font-semibold text-sm">TOTAL COTIZACIÓN:</span>
                <span className="text-2xl font-bold">${totalPrice.toLocaleString('es-CL')}</span>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 mt-6 pt-4 border-t border-gray-100">
              <DialogClose asChild>
                <Button type="button" variant="outline" 
                    className="border-gray-300">Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" 
                className="bg-[#E33439] hover:bg-[#c12a2f] text-white font-bold">Guardar Cotización
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}