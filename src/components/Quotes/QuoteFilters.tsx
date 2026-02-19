"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { QuoteFilters } from "@/interfaces/Quote";

interface Props {
  onFilterChange: (filters: QuoteFilters) => void;
}

export default function QuoteFilter({ onFilterChange }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estado, setEstado] = useState("todos");

  const emitFilters = (newSearch: string, newStatus: string) => {
    onFilterChange({
      searchTerm: newSearch || undefined,
      status: newStatus !== "todos" ? newStatus : undefined,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchTerm(val);
    emitFilters(val, estado);
  };

  const handleStatusChange = (val: string) => {
    setEstado(val);
    emitFilters(searchTerm, val);
  };

  return (
    <Card className="border-gray-100 shadow-sm w-full">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          
          <div className="space-y-2 w-full">
            <Label htmlFor="search" className="text-sm text-gray-600 font-medium">Buscar</Label>
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="search"
                placeholder="N° cotización..."
                className="pl-9 bg-gray-50/50 border-gray-200 w-full"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="space-y-2 w-full">
            <Label className="text-sm text-gray-600 font-medium">Estado</Label>
            <Select value={estado} onValueChange={handleStatusChange}>
              <SelectTrigger className="bg-gray-50/50 border-gray-200 w-full">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                {/* Estos values coinciden con las validaciones de tu C# */}
                <SelectItem value="Pendiente">Pendiente</SelectItem>
                <SelectItem value="Aprobada">Aprobada</SelectItem>
                <SelectItem value="Rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}