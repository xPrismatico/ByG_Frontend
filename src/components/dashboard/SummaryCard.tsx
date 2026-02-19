// src/components/dashboard/SummaryCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation"; //

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  linkText: string;
  href: string; //
}

export function SummaryCard({ title, value, icon: Icon, colorClass, linkText, href }: SummaryCardProps) {
  const router = useRouter(); //
  
  // Separamos las clases de color para aplicarlas correctamente
  const classes = colorClass.split(' ');
  const borderColor = classes[0]; // ej: border-l-blue-500
  const textColor = classes[1];   // ej: text-blue-600

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(href); //
  };

  return (
    <Card className={`border-l-4 shadow-sm ${borderColor}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${textColor}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${textColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-gray-800">{value}</div>
        <Button 
          variant="link" 
          className={`px-0 h-auto mt-2 font-semibold ${textColor}`}
          onClick={handleNavigation} //
        >
          {linkText} <ArrowUpRight className="ml-1 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}