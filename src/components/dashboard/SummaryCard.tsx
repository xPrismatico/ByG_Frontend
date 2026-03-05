"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface SummaryCardProps {
  title: string;
  subTitle?: string;
  value: number; 
  icon: LucideIcon;
  colorClass: string;
  // ✅ CORRECCIÓN: Agregamos estas props de nuevo como opcionales
  linkText?: string; 
  href?: string;
}

export function SummaryCard({ title, subTitle, value, icon: Icon, colorClass, linkText, href }: SummaryCardProps) {
  const router = useRouter();
  const classes = colorClass.split(' ');
  const borderColor = classes[0]; 
  const textColor = classes[1];

  return (
    <Card className={`border-l-[3px] shadow-sm bg-white ${borderColor} overflow-hidden h-full`}>
      <CardContent className="px-4 py-3 flex flex-col justify-between h-full gap-1">
        <div className="flex justify-between items-start">
            <div>
                <p className={`text-[11px] font-bold uppercase tracking-wider ${textColor} opacity-90 leading-tight`}>{title}</p>
                {subTitle && <p className="text-[10px] text-slate-400 font-medium mt-0.5 leading-tight truncate">{subTitle}</p>}
            </div>
            <div className={`p-1 rounded bg-slate-50 ${textColor.replace('text-', 'bg-').replace('600', '50')} bg-opacity-20`}>
                <Icon className={`h-3.5 w-3.5 ${textColor}`} />
            </div>
        </div>
        
        <div className="flex items-end justify-between mt-1">
            <div className="text-xl font-bold text-slate-900 leading-none">
                {value === -1 ? (
                    <div className="h-5 w-8 bg-slate-100 animate-pulse rounded"/>
                ) : (
                    value
                )}
            </div>
            
            {/* Solo mostramos el enlace si se proveen las props */}
            {linkText && href && (
                <button 
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${textColor} hover:underline`}
                  onClick={() => router.push(href)}
                >
                  {linkText} <ArrowUpRight className="h-2.5 w-2.5" />
                </button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}