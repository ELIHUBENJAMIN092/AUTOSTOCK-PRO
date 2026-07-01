"use client";

import { Package, CheckCircle, Scan, Tags, Radio, AlertTriangle } from "lucide-react";

type Props = {
  totalProducts: number;
  activeProducts: number;
  rfidEnabledProducts: number;
  totalCategories: number;
  totalRFIDTags: number;
  lowStockProducts: number;
};

const cards = [
  {
    label: "Productos totales",
    value: "totalProducts",
    icon: Package,
    gradient: "from-sky-950 to-sky-900",
    border: "border-sky-700",
    labelColor: "text-sky-300",
    valueColor: "text-white",
    descColor: "text-sky-200",
    desc: "Incluye productos activos e inactivos.",
  },
  {
    label: "Productos activos",
    value: "activeProducts",
    icon: CheckCircle,
    gradient: "from-emerald-950 to-emerald-900",
    border: "border-emerald-700",
    labelColor: "text-emerald-300",
    valueColor: "text-white",
    descColor: "text-emerald-200",
    desc: "Productos disponibles para venta.",
  },
  {
    label: "Productos RFID",
    value: "rfidEnabledProducts",
    icon: Scan,
    gradient: "from-violet-950 to-violet-900",
    border: "border-violet-700",
    labelColor: "text-violet-300",
    valueColor: "text-white",
    descColor: "text-violet-200",
    desc: "Productos con control RFID activado.",
  },
  {
    label: "Categorías",
    value: "totalCategories",
    icon: Tags,
    gradient: "from-amber-950 to-amber-900",
    border: "border-amber-700",
    labelColor: "text-amber-300",
    valueColor: "text-white",
    descColor: "text-amber-200",
    desc: "Categorías creadas en el catálogo.",
  },
  {
    label: "Etiquetas RFID",
    value: "totalRFIDTags",
    icon: Radio,
    gradient: "from-fuchsia-950 to-fuchsia-900",
    border: "border-fuchsia-700",
    labelColor: "text-fuchsia-300",
    valueColor: "text-white",
    descColor: "text-fuchsia-200",
    desc: "Tags RFID registrados en el sistema.",
  },
  {
    label: "Stock bajo",
    value: "lowStockProducts",
    icon: AlertTriangle,
    gradient: "from-rose-950 to-rose-900",
    border: "border-rose-700",
    labelColor: "text-rose-300",
    valueColor: "text-white",
    descColor: "text-rose-200",
    desc: "Productos con stock menor o igual a 5.",
  },
];

export default function StatsCards(props: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        const val = props[card.value as keyof Props] as number;
        return (
          <div
            key={card.value}
            className={`p-4 md:p-6 rounded-3xl bg-gradient-to-br ${card.gradient} border ${card.border} shadow-sm space-y-3`}
          >
            <div className="flex items-center justify-between">
              <p className={`text-xs md:text-sm uppercase ${card.labelColor} tracking-wider`}>
                {card.label}
              </p>
              <Icon size={20} className={`${card.labelColor} shrink-0`} />
            </div>
            <p className={`text-3xl md:text-4xl font-semibold ${card.valueColor}`}>{val}</p>
            <p className={`text-xs md:text-sm ${card.descColor}`}>{card.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
