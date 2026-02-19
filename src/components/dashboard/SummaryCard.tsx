// src/components/dashboard/SummaryCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  colorClass: string; // Ejemplo: "border-l-blue-500 text-blue-600"
  linkText: string;
}

export function SummaryCard({ title, value, icon: Icon, colorClass, linkText }: SummaryCardProps) {
  return (
    <Card className={`border-l-4 shadow-sm ${colorClass.split(' ')[0]}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className={`text-sm font-medium ${colorClass.split(' ')[1]}`}>
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 ${colorClass.split(' ')[1].replace('600', '500')}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-4xl font-bold ${colorClass.split(' ')[1].replace('600', '700')}`}>
          {value}
        </div>
        <Button variant="link" className={`px-0 h-auto mt-2 ${colorClass.split(' ')[1]}`}>
          {linkText} <ArrowUpRight className="ml-1 h-3 w-3" />
        </Button>
      </CardContent>
    </Card>
  );
}